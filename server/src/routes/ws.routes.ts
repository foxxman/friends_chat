import { Request } from "express";
import express from "express";
import chalk from "chalk";
import { WebSocket, WebSocketServer } from "ws";
import User from "../models/User.js";
import mongoose from "mongoose";
import strToObjId from "../utils/strToObjId.js";
import Room from "../models/Room.js";
import { resolve } from "path";
import { nanoid } from "nanoid";

export enum SOCKET_METHODS {
  CONNECTION = "connection",
  ROOMS_LIST = "rooms_list",
  ERROR = "error",
  GET_ROOM_STATE = "get_room_state",
  ROOM_STATE = "room_state",
  INVITE_USER = "invite_user",
  REMOVE_USER_FROM_ROOM = "remove_user_from_room",
  ROOM_MESSAGE = "room_message",
  REMOVE_ROOM = "remove_room",
  LEAVE_ROOM = "leave_room",
}

export interface ISocketMessage {
  method: SOCKET_METHODS;
  userId: string;
  roomId?: string;
  message?: {
    text: string;
  };
  userToInviteId?: string;
  userToRemoveId?: string;
}

export interface wsSession extends WebSocket {
  roomId?: string;
  userId?: string;
}

function wsFunc(ws: wsSession, aWss: WebSocketServer) {
  ws.onmessage = (event) => {
    const { data } = event;
    const message: ISocketMessage = JSON.parse(data.toString());

    switch (message.method) {
      case SOCKET_METHODS.CONNECTION:
        connectionHandler(ws, message);
        break;
      case SOCKET_METHODS.GET_ROOM_STATE:
        sendRoomState(ws, message);
        let len = 0;
        aWss.clients.forEach(() => len++);
        if (aWss.clients) console.log("clients: ", len);
        break;
      case SOCKET_METHODS.ROOM_MESSAGE:
        broadcastRoomMessage(ws, message, aWss);
        break;
      case SOCKET_METHODS.INVITE_USER:
        inviteUserToRoom(ws, message, aWss);
        break;
      case SOCKET_METHODS.REMOVE_USER_FROM_ROOM:
        removeUserFromRoom(ws, message, aWss);
        break;
      case SOCKET_METHODS.REMOVE_ROOM:
        removeRoom(ws, message, aWss);
        break;
      case SOCKET_METHODS.LEAVE_ROOM:
        leaveRoom(ws, message, aWss);
        break;
    }
  };

  ws.onclose = (event) => {
    console.log(`closed ${ws.userId}`);

    let len = 0;
    aWss.clients.forEach(() => len++);
    if (aWss.clients) console.log("clients: ", len);
  };
}

const removeRoom = async (ws: wsSession, msg: ISocketMessage, aWss: WebSocketServer) => {
  const { roomId, userId } = msg;
  try {
    const roomToRemove = await Room.findById(roomId);
    if (roomToRemove && userId === String(roomToRemove.admin?._id)) {
      // удаляем комнату из объектов пользователей
      roomToRemove.members.forEach(async (memberId) => {
        const member = await User.findById(memberId);
        if (member) {
          const newRoomsArr = member.rooms.filter((id) => String(id) !== String(roomToRemove._id));
          await User.findByIdAndUpdate(memberId, { rooms: newRoomsArr }, { new: true });
        }
      });
      // удаляемсаму комнату
      await Room.findByIdAndDelete(roomToRemove._id);
      // сообщения по актуальным сессиям юзеров комнаты
      aWss.clients.forEach(async (client: wsSession) => {
        if (client.userId && roomToRemove.members.includes(strToObjId(client.userId))) client.send(JSON.stringify(msg));
      });
    } else {
      ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Oops...something wrong, try later" }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Something wrong, try later" }));
  }
};

const leaveRoom = async (ws: wsSession, msg: ISocketMessage, aWss: WebSocketServer) => {
  const { roomId, userId } = msg;
  try {
    const roomToLeave = await Room.findById(roomId);
    const leavedUser = await User.findById(userId);

    if (
      leavedUser &&
      roomToLeave &&
      roomToLeave.members.includes(leavedUser._id) &&
      String(leavedUser._id) !== String(roomToLeave.admin?._id)
    ) {
      // удаляем комнату из объекта пользователя
      const newRoomsArr = leavedUser.rooms.filter((id) => String(id) !== String(roomToLeave._id));
      // удаляем пользователя из комнаты
      const newMembersArr = roomToLeave.members.filter((id) => String(id) !== String(leavedUser._id));

      // обновляем объекты
      await Room.findByIdAndUpdate(roomToLeave._id, { members: newMembersArr }, { new: true });
      await User.findByIdAndUpdate(leavedUser._id, { rooms: newRoomsArr }, { new: true });

      // сообщение пользователм о его удалении юзера
      // цикл по всем актуальным сессиям
      aWss.clients.forEach(async (client: wsSession) => {
        // в одной сессии
        if (client.roomId === msg.roomId) client.send(JSON.stringify(msg));
      });
    } else {
      ws.send(
        JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Oops...looks like you can't leave this room" }),
      );
    }
  } catch (error) {
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Something wrong, try later" }));
  }
};

const removeUserFromRoom = async (ws: wsSession, msg: ISocketMessage, aWss: WebSocketServer) => {
  try {
    const room = await Room.findById(msg.roomId);
    const userToRemove = await User.findById(msg.userToRemoveId);

    if (room && userToRemove && String(room.admin?._id) === msg.userId && room.members.includes(userToRemove._id)) {
      const newMembersList = room.members.filter((m) => String(m) !== String(userToRemove._id));
      const newRemovedUserRooms = userToRemove.rooms.filter((r) => String(r) !== String(room._id));

      await Room.findByIdAndUpdate(room._id, { members: newMembersList }, { new: true });
      await User.findByIdAndUpdate(userToRemove._id, { rooms: newRemovedUserRooms }, { new: true });
      console.log("user removed");

      // цикл по всем актуальным сессиям
      aWss.clients.forEach(async (client: wsSession) => {
        //был в комнате до удаления юзера
        if (client.userId && room.members.includes(strToObjId(client.userId))) client.send(JSON.stringify(msg));
      });
    } else {
      ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "You cant remove this user" }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Removing error, try later" }));
  }
};

const inviteUserToRoom = async (ws: wsSession, msg: ISocketMessage, aWss: WebSocketServer) => {
  try {
    const room = await Room.findById(msg.roomId);
    const invitedUser = await User.findById(msg.userToInviteId);

    // если приглашающий состоит в комнате  а приглашаемый нет
    if (
      room &&
      invitedUser &&
      room.members.includes(strToObjId(msg.userId)) &&
      !room.members.includes(invitedUser._id)
    ) {
      const updatedRoom = await Room.findByIdAndUpdate(
        room._id,
        { members: [...room.members, invitedUser] },
        { new: true },
      );
      await User.findByIdAndUpdate(invitedUser._id, { rooms: [...invitedUser.rooms, room._id] }, { new: true });

      aWss.clients.forEach(async (client: wsSession) => {
        // если юзер есть в комнате
        if (client.userId && updatedRoom?.members.includes(strToObjId(client.userId))) client.send(JSON.stringify(msg));
      });
    }
  } catch (error: any) {
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: "Inviting error, try later" }));
  }
};

const connectionHandler = async (ws: wsSession, msg: ISocketMessage) => {
  //  добавл. id юзера в сессии
  ws.userId = String(msg.userId);
  console.log("CONNECTED", chalk.blue(ws.userId));

  try {
    const userData = await User.findById(msg.userId);

    if (!userData) throw new Error("user_not_found");
    // находим все комнаты юзера и отправляем ему
    const userRooms = userData.rooms
      .map(async (roomId) => {
        const room = await Room.findById(roomId);
        if (room) return { _id: room._id, roomname: room.roomname, updatedAt: room.updatedAt };
      })
      .filter((r) => r);

    Promise.all(userRooms).then((res) => {
      // send user's chats
      ws.send(JSON.stringify({ method: SOCKET_METHODS.ROOMS_LIST, rooms: res }));
    });
  } catch (error: any) {
    console.log(error.message);
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: error.message }));
  }
};

const sendRoomState = async (ws: wsSession, msg: ISocketMessage) => {
  ws.roomId = String(msg.roomId);
  console.log("CONNECTED TO ROOM", chalk.green(ws.roomId), chalk.blue(ws.userId));

  try {
    if (!msg.roomId) throw new Error("Room not found");
    const room = await Room.findById(msg.roomId);
    // если комната не найдена или юзер в ней не состоит

    if (!room || !room.members.includes(strToObjId(msg.userId))) throw new Error("Room not found");

    ws.send(JSON.stringify({ method: SOCKET_METHODS.ROOM_STATE, room }));
  } catch (error: any) {
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: error.message }));
  }
};

// // широковещательная рассылка
const broadcastRoomMessage = async (ws: wsSession, msg: ISocketMessage, aWss: WebSocketServer) => {
  try {
    console.log("NEW MESSAGE");

    console.log(msg);

    const room = await Room.findById(msg.roomId);
    const user = await User.findById(msg.userId);

    console.log("found user and room: ", !!room && !!user);

    if (room && user && msg.message) {
      const newMessage = {
        _id: nanoid(),
        user: {
          _id: user._id,
          name: user.login,
        },
        room: {
          _id: room._id,
          name: room.roomname,
        },
        text: msg.message?.text,
      };

      console.log("updating room...");

      const updatedRoom = await Room.findByIdAndUpdate(
        room._id,
        { messages: [...room.messages, newMessage] },
        { new: true },
      );
      console.log("room updated");

      // console.log("updatedRoom", updatedRoom);

      if (updatedRoom) {
        // цикл по всем актуальным сессиям
        aWss.clients.forEach(async (client: wsSession) => {
          // в одной сессии
          console.log("aWss client id:", client.userId);

          if (client.roomId === ws.roomId)
            client.send(
              JSON.stringify({ ...msg, message: updatedRoom.messages.find((m) => m._id === newMessage._id) }),
            );
        });
      }
    }
  } catch (error: any) {
    console.log(error.message);
    ws.send(JSON.stringify({ method: SOCKET_METHODS.ERROR, error_message: error.message }));
  }
};

export default wsFunc;

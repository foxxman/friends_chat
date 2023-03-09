import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import roomService from "../services/room.service";
import history from "../utils/history";
import roomState from "./roomState";
import userState from "./userState";

export enum SOCKET_METHODS {
  CONNECTION = "connection",
  ROOMS_LIST = "rooms_list",
  ERROR = "error",
  GET_ROOM_STATE = "get_room_state",
  ROOM_STATE = "room_state",
  ROOM_MESSAGE = "room_message",
  INVITE_USER = "invite_user",
  REMOVE_USER_FROM_ROOM = "remove_user_from_room",
  REMOVE_ROOM = "remove_room",
  LEAVE_ROOM = "leave_room",
}

export interface IRoom {
  _id: string;
  roomname: string;
  messages: IChatMessage[];
  admin: {
    _id: string;
    name: string;
  };
  members: string[];
}

export interface ISocketMessage {
  method: SOCKET_METHODS;
  error_message?: string;
  room?: IRoom;
  rooms?: IRoomsListItem[];
  message?: IChatMessage;
  userId?: string;
  roomId?: string;
  userToInviteId?: string;
  userToRemoveId?: string;
}

export interface IRoomsListItem {
  _id: string;
  roomname: string;
  updatedAt: string;
}

export interface IChatMessage {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  text: string;
  room: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

class ChatsState {
  userId: null | string = null;
  rooms: IRoomsListItem[] | null = null;
  socket: WebSocket | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserChats(userId: string) {
    this.userId = userId;
    this.initSocket();
  }

  setRooms(rooms: IRoomsListItem[]) {
    this.rooms = rooms
      .filter((r) => !!r)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  pushRoom(room: IRoomsListItem) {
    if (this.rooms) this.rooms.unshift(room);
  }

  initSocket() {
    if (!process.env.REACT_APP_SOCKET_URL) return;
    const socket = new WebSocket(process.env.REACT_APP_SOCKET_URL);

    socket.onopen = () => {
      // console.log("open socket");

      socket.send(
        JSON.stringify({
          userId: this.userId,
          method: SOCKET_METHODS.CONNECTION,
        })
      );
    };

    socket.onmessage = (e: MessageEvent) => {
      const msg: ISocketMessage = JSON.parse(e.data);

      switch (msg.method) {
        case SOCKET_METHODS.ROOMS_LIST:
          // подгружаем список комнат
          if (msg.rooms) this.setRooms(msg.rooms);
          userState.setIsLoading(false);
          break;
        case SOCKET_METHODS.ROOM_STATE:
          if (msg.room) roomState.setRoom(msg.room);
          break;
        case SOCKET_METHODS.ROOM_MESSAGE:
          if (msg.roomId === roomState.chatId && msg.message)
            roomState.addMessage(msg.message);
          break;
        case SOCKET_METHODS.INVITE_USER:
          if (msg.userToInviteId === this.userId && msg.roomId) {
            this.getRoomByIdAndPush(msg.roomId);
          } else {
            if (msg.userToInviteId && roomState.chatId === msg.roomId) {
              roomState.pushMemberId(msg.userToInviteId);
              roomState.loadUsersList();
              toast.info("Invited new member to " + roomState.chatName);
            }
          }
          break;
        case SOCKET_METHODS.REMOVE_USER_FROM_ROOM:
          this.removeUserFromRoom(msg);
          break;
        case SOCKET_METHODS.REMOVE_ROOM:
          if (msg.roomId) this.removeRoomRes(msg.roomId);
          break;
        case SOCKET_METHODS.LEAVE_ROOM:
          if (msg.userId)
            this.removeUserFromRoom({ ...msg, userToRemoveId: msg.userId });

          break;
        case SOCKET_METHODS.ERROR:
          toast.error(msg.error_message || "Oops...something wrong");
          break;
      }
    };

    this.setSocket(socket);
  }

  removeUserFromRoom(msg: ISocketMessage) {
    if (msg.userToRemoveId) {
      if (this.rooms && msg.userToRemoveId === userState.auth.userId) {
        this.setRooms(this.rooms.filter((r) => r._id !== msg.roomId));

        if (roomState.chatId === msg.roomId) roomState.removeRoomState();

        history.push(`/chat/${userState.auth.userId}`);

        toast.error("You removed from this chat");
      } else {
        if (roomState.chatId === msg.roomId)
          roomState.removeUserRes(msg.userToRemoveId, msg.method);
      }
    }
  }
  async getRoomByIdAndPush(roomId: string) {
    const data = await roomService.getById(roomId);

    if (this.rooms && data?.content)
      this.rooms.push({
        _id: data.content._id,
        roomname: data.content.roomname,
        updatedAt: data.content.updatedAt,
      });
  }
  async createRoom(roomname: string) {
    try {
      const data: { content: IRoomsListItem } | undefined =
        await roomService.create(roomname);
      if (data) this.pushRoom(data.content);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  removeRoomReq(roomId: string) {
    const userId = this.userId;
    this.socket?.send(
      JSON.stringify({
        method: SOCKET_METHODS.REMOVE_ROOM,
        userId,
        roomId,
      })
    );
  }
  leaveRoomReq(roomId: string) {
    const userId = this.userId;
    this.socket?.send(
      JSON.stringify({
        method: SOCKET_METHODS.LEAVE_ROOM,
        userId,
        roomId,
      })
    );
  }

  removeRoomRes(roomId: string) {
    if (this.rooms)
      this.setRooms(this.rooms.filter((room) => room._id !== roomId));
    if (roomState.chatId === roomId) {
      history.push(`/chat/${userState.auth.userId}`);
      roomState.removeRoomState();
    }
  }

  setChat(chatId: string) {
    // console.log("set chat request");

    if (this.rooms?.find((r) => r._id === chatId))
      this.socket?.send(
        JSON.stringify({
          userId: this.userId,
          roomId: chatId,
          method: SOCKET_METHODS.GET_ROOM_STATE,
        })
      );
  }

  removeState() {
    this.userId = null;
    this.rooms = null;
    this.socket?.close();
    this.socket = null;
  }
}

export default new ChatsState();

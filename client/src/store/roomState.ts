import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import roomService from "../services/room.service";
import userService, { IUserData } from "../services/user.service";
import history from "../utils/history";
import chatsState, { IChatMessage, IRoom, SOCKET_METHODS } from "./chatsState";
import userState from "./userState";

class roomState {
  chatId: string | null = null;
  chatName: string | null = null;
  messages: IChatMessage[] | null = null;
  admin: {
    _id: string;
    name: string;
  } | null = null;
  membersIds: string[] | null = null;
  scroll: HTMLDivElement | null = null;
  loading: boolean = false;
  membersList: IUserData[] | null = null;
  // messagesLoading

  constructor() {
    makeAutoObservable(this);
  }

  setChatId(id: string) {
    this.chatId = id;
  }
  setRoom(room: IRoom) {
    this.chatId = room._id;
    this.admin = room.admin;
    this.chatName = room.roomname;
    this.messages = room.messages;
    this.membersIds = room.members;
    this.loadUsersList();
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setMembersList(list: IUserData[]) {
    this.membersList = [...list];
  }

  async loadUsersList() {
    if (!this.chatId) return;
    this.setLoading(true);
    const data = await roomService.getRoomMembers(this.chatId);

    if (data?.content.users) this.setMembersList(data.content.users);
    this.setLoading(false);
  }

  setScroll(scroll: HTMLDivElement) {
    this.scroll = scroll;
  }

  scrollToEnd() {
    setTimeout(() => {
      if (this.scroll) this.scroll.scrollTop = this.scroll.scrollHeight;
    }, 100);
  }

  sendMessage(message: string) {
    chatsState.socket?.send(
      JSON.stringify({
        method: SOCKET_METHODS.ROOM_MESSAGE,
        userId: userState.auth.userId,
        roomId: this.chatId,
        message: {
          text: message,
        },
      })
    );
  }

  addMessage(message: IChatMessage) {
    this.messages?.push(message);
    this.scrollToEnd();
  }

  inviteMember(userToInviteId: string) {
    const roomId = this.chatId;
    chatsState.socket?.send(
      JSON.stringify({
        method: SOCKET_METHODS.INVITE_USER,
        userId: userState.auth.userId,
        roomId,
        userToInviteId,
      })
    );
  }

  pushMemberId(userId: string) {
    if (this.membersIds) this.membersIds.push(userId);
  }

  removeUserReq(userId: string) {
    const roomId = this.chatId;
    chatsState.socket?.send(
      JSON.stringify({
        method: SOCKET_METHODS.REMOVE_USER_FROM_ROOM,
        userId: userState.auth.userId,
        roomId,
        userToRemoveId: userId,
      })
    );
  }
  removeUserRes(userId: string, method: SOCKET_METHODS) {
    if (this.membersIds)
      this.membersIds = this.membersIds.filter((id) => id !== userId);
    if (this.membersList) {
      const userToRemove = this.membersList.find((m) => m._id === userId);
      this.membersList = this.membersList.filter((m) => m._id !== userId);
      if (method === SOCKET_METHODS.LEAVE_ROOM)
        toast.error(`${userToRemove?.login || "somebody"} leave this chat`);
      else
        toast.error(
          `Admin removed ${userToRemove?.login || "somebody"} from this chat`
        );
    }
  }

  removeRoomState() {
    history.replace(`/chat/${userState.auth.userId}`);

    this.chatId = null;
    this.chatName = null;
    this.messages = null;
    this.admin = null;
    this.membersIds = null;
    this.scroll = null;
    this.loading = false;
    this.membersList = null;
  }
}

export default new roomState();

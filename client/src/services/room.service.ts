import { IRoom } from "./../store/chatsState";
import { IUserData } from "./user.service";
import { toast } from "react-toastify";
import { IRoomsListItem } from "../store/chatsState";

import httpService from "./http.service";

const roomEndpoint = "room/";

const roomService = {
  //   getDesks: async () => {
  //     // console.log("desks list request");
  //     try {
  //       const { data } = await httpService.get(deskEndpoint);
  //       // console.log("getdesks: ", data);
  //       // console.log(data);

  //       return data;
  //     } catch (error: any) {
  //       toast(error.message);
  //     }
  //   },
  create: async (roomname: string) => {
    try {
      const { data }: { data: { content: IRoomsListItem } } =
        await httpService.post(roomEndpoint, { roomname });
      return data;
    } catch (error: any) {
      toast(error.message);
    }
  },

  getRoomMembers: async (roomId: string) => {
    try {
      const { data }: { data: { content: { users: IUserData[] } } } =
        await httpService.get(roomEndpoint + "getRoomMembers/" + roomId);
      return data;
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  getByRoomname: async (roomname: string) => {
    try {
      const { data }: { data: { content: { rooms: IRoomsListItem[] } } } =
        await httpService.get(roomEndpoint + `getByRoomname/${roomname}`);
      return data.content;
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  //   update: async (content: {
  //     _id: string;
  //     deskname?: string;
  //     data?: string;
  //   }) => {
  //     try {
  //       const { data } = await httpService.patch(
  //         deskEndpoint + content._id,
  //         content
  //       );
  //       return data;
  //     } catch (error: any) {
  //       toast(error.message);
  //     }
  //   },

  getById: async (roomId: string) => {
    try {
      const { data }: { data: { content: IRoomsListItem } } =
        await httpService.get(roomEndpoint + roomId);
      return data;
    } catch (error: any) {
      toast(error.message);
    }
  },
  //   addUser: async (deskId: string, userId: string) => {
  //     try {
  //       const { data } = await httpService.patch(
  //         deskEndpoint + `addUser/${deskId}`,
  //         { userToAdd: userId }
  //       );

  //       toast.info("New user added.");

  //       return data;
  //     } catch (error: any) {
  //       toast(error.message);
  //     }
  //   },

  //   remove: async (deskId: string) => {
  //     try {
  //       const { data } = await httpService.delete(deskEndpoint + deskId);
  //       return data;
  //     } catch (error: any) {
  //       toast(error.message);
  //     }
  //   },
  //   removeUser: async (deskId: string, userId: string) => {
  //     try {
  //       const { data } = await httpService.patch(
  //         deskEndpoint + `removeUser/${deskId}`,
  //         {
  //           userToRemove: userId,
  //         }
  //       );

  //       console.log(data);

  //       return daWoohoo, you're reading this text in a modal!ta;
  //     } catch (error: any) {
  //       toast(error.message);
  //     }
  //   },
};

export default roomService;

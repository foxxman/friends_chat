import { toast } from "react-toastify";
import config from "../config.json";
import axios from "axios";

const httpUser = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "user/",
});
// const userEndpoint = "user/";

export interface IUserData {
  login: string;
  _id: string;
}

const userService = {
  getById: async (userId: string) => {
    try {
      const { data }: { data: IUserData } = await httpUser.get(userId);
      return data;
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  getByLogin: async (login: string) => {
    try {
      const { data }: { data: { users: IUserData[] } } = await httpUser.get(
        `getByLogin/${login}`
      );
      return data;
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  getByIds: (ids: string[]) => {
    const data: IUserData[] = [];

    ids.forEach(async (id) => {
      try {
        const user = await userService.getById(id);
        if (user) data.push(user);
      } catch (error) {
        toast.error("Cant load all users");
      }
    });

    return data;
  },
};

export default userService;

import { ILoginData } from "./../utils/formInterfaces";
import axios from "axios";

import localStorageService, { ISetTokens } from "./localStorage.service";

const httpAuth = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "auth/",
});

export interface IAuthData extends ISetTokens {
  login: string;
}

const authService = {
  register: async (payload: ILoginData): Promise<IAuthData> => {
    const { data }: { data: IAuthData } = await httpAuth.post(
      `signUp`,
      payload
    );
    return data;
  },
  login: async (payload: ILoginData): Promise<IAuthData> => {
    const { login, password } = payload;
    console.log(httpAuth.getUri());
    console.log("login requested");

    const { data }: { data: IAuthData } = await httpAuth.post(
      `signInWithPassword`,
      {
        login,
        password,
        returnSecureToken: true,
      }
    );
    console.log("login response");

    return data;
  },
  refresh: async (): Promise<IAuthData> => {
    const { data } = await httpAuth.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;

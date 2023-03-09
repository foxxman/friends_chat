import React from "react";
import Chat from "../pages/Chat";
import Login from "../pages/Login";

export interface IRoute {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export enum RouteNames {
  LOGIN = "/login",
  CHAT = "/chat/:userId?/:chatId?",
}

export const publicRoutes: IRoute[] = [
  {
    path: RouteNames.LOGIN,
    component: Login,
    exact: true,
  },
];

export const privateRoutes: IRoute[] = [
  {
    path: RouteNames.CHAT,
    component: Chat,
    exact: true,
  },
];

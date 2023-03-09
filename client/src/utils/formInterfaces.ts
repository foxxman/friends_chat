export enum USER_FIELDS {
  LOGIN = "login",
  PASSWORD = "password",
  ID = "_id",
}

export interface RegisterResp {
  [USER_FIELDS.LOGIN]: string;
  [USER_FIELDS.PASSWORD]: string;
  [USER_FIELDS.ID]: string;
}

export interface IFormErrors {
  [index: string]: string;
}

export interface ILoginData {
  [index: string]: string;
}

export interface IValidConfig {
  [index: string]: {
    [index: string]: IValidMethod;
  };
}

export interface IValidMethod {
  message?: string;
  value?: number | string;
}

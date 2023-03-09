import { IAuthData } from "./auth.service";

enum STORAGE_ENUM {
  TOKEN_KEY = "jwt-token",
  REFRESH_KEY = "jwt-refresh-token",
  EXPIRES_KEY = "jwt-expires",
  USERID_KEY = "user-local-id",
  USERLOGIN_KEY = "user-login",
}

export interface ISetTokens {
  refreshToken: string;
  accessToken: string;
  userId: string;
  expiresIn: number;
}

function setTokens({
  refreshToken,
  accessToken,
  userId,
  expiresIn = 3600,
  login,
}: IAuthData) {
  const expiresDate = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem(STORAGE_ENUM.USERID_KEY, userId);
  localStorage.setItem(STORAGE_ENUM.USERLOGIN_KEY, login);
  localStorage.setItem(STORAGE_ENUM.TOKEN_KEY, accessToken);
  localStorage.setItem(STORAGE_ENUM.REFRESH_KEY, refreshToken);
  localStorage.setItem(STORAGE_ENUM.EXPIRES_KEY, `${expiresDate}`);
}

function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_ENUM.TOKEN_KEY);
}
function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_ENUM.REFRESH_KEY);
}
function removeAuthData(): void {
  console.log("removeAuthData");
  localStorage.removeItem(STORAGE_ENUM.USERID_KEY);
  localStorage.removeItem(STORAGE_ENUM.TOKEN_KEY);
  localStorage.removeItem(STORAGE_ENUM.REFRESH_KEY);
  localStorage.removeItem(STORAGE_ENUM.EXPIRES_KEY);
  localStorage.removeItem(STORAGE_ENUM.USERLOGIN_KEY);
}

function getTokenExpiresDate(): string | null {
  return localStorage.getItem(STORAGE_ENUM.EXPIRES_KEY);
}
function getUserId(): string | null {
  return localStorage.getItem(STORAGE_ENUM.USERID_KEY);
}

function getUserLogin(): string | null {
  return localStorage.getItem(STORAGE_ENUM.USERLOGIN_KEY);
}

const localStorageService = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  getUserId,
  removeAuthData,
  getUserLogin,
};
export default localStorageService;

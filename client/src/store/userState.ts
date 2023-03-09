import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import authService from "../services/auth.service";
import { generetaAuthError } from "../services/generateAuthError";
import localStorageService from "../services/localStorage.service";
import { ILoginData } from "../utils/formInterfaces";
import history from "../utils/history";

class userState {
  isLoading = false;
  error: null | string = null;
  auth: { userId: string | null; login: string | null } = {
    userId: null,
    login: null,
  };
  isLoggedIn = false;
  dataLoaded = false;

  constructor() {
    makeAutoObservable(this);

    if (localStorageService.getAccessToken()) {
      this.isLoading = false;
      this.error = null;
      this.auth.userId = localStorageService.getUserId();
      this.auth.login = localStorageService.getUserLogin();
      this.isLoggedIn = true;
      this.dataLoaded = false;
    }
  }

  setError(error: string) {
    this.error = error;
    toast.error(error);
  }
  setIsLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setAuthUser(userId: string, login: string) {
    this.auth.userId = userId;
    this.auth.login = login;
    this.isLoggedIn = true;
  }

  userLoggedOut() {
    this.isLoggedIn = false;
    this.auth.userId = null;
    this.auth.login = null;
    this.dataLoaded = false;
  }

  private errorHandler(error: any) {
    const erMessage = error.response
      ? error.response.status === 400
        ? generetaAuthError(error.response.data.error.message)
        : error.response.data.error.message
      : error.message || "Something wrong...";

    this.setError(erMessage);
  }

  async signUp(payload: ILoginData) {
    try {
      this.setIsLoading(true);
      const data = await authService.register(payload);

      localStorageService.setTokens(data);

      this.setAuthUser(data.userId, data.login);
      this.setIsLoading(false);

      // history.push(`/chat/${data.userId}`);
      history.push(`/chat/`);
    } catch (error: any) {
      this.setIsLoading(false);
      this.errorHandler(error);
    }
  }

  async login(payload: { login: string; password: string }) {
    const { login, password } = payload;

    try {
      this.setIsLoading(true);

      const data = await authService.login({ login, password });
      localStorageService.setTokens(data);

      this.setAuthUser(data.userId, data.login);
      this.setIsLoading(false);

      history.push(`/chat/`);
    } catch (error: any) {
      this.setIsLoading(false);
      this.errorHandler(error);
    }
  }

  logout = () => {
    console.log("logout");
    localStorageService.removeAuthData();
    this.userLoggedOut();
    history.push("/");
  };
}

export default new userState();

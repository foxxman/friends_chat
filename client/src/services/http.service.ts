import axios from "axios";
import { toast } from "react-toastify";
import authService from "./auth.service";
import localStorageService from "./localStorage.service";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// обновление токена и добавление accessToken в запрос
http.interceptors.request.use(
  async function (config) {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();

    // проверяем, истек ли токен
    const isExpired = expiresDate
      ? refreshToken && Number(expiresDate) < Date.now()
      : null;

    //   обновляем истекший токен
    if (isExpired) {
      const data = await authService.refresh();

      localStorageService.setTokens(data);
    }

    const accessToken = localStorageService.getAccessToken();

    // КОСТЫЛЬ
    // https://stackoverflow.com/questions/69524573/why-config-headers-in-interceptor-is-possibly-undefined
    if (!config?.headers)
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    else if (accessToken)
      config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// обработка ошибок
http.interceptors.response.use(
  (res) => {
    res.data = { content: res.data };
    return res;
  },

  function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErrors) {
      console.log(error);
      toast.error("Somthing was wrong. Try it later");
    }

    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;

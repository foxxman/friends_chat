// проверка аторизации при обновлении информации пользователя

import { Request, Response } from "express";
import tokenService from "../services/token.service.js";

export default async (req: Request, res: Response, next: Function) => {
  // next - функция, с пом. которой можем продолжать дальнейшие запросы
  if (req.method === "OPTIONS") {
    // OPTIONS - системный запрос, обрабатываем отдельно
    // просто продолжаем работу
    return next();
  }

  try {
    //   получим строку
    // Bearer [token]
    // вырезаем только второе слово, token

    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    // console.log(token);

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // верифицируем токен
      const data = await tokenService.validateAccess(token);

      // console.log("TOKEN: ", tokenService.validateAccess(token));

      // ошибка если не верифицированно
      if (!data) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // console.log("decoded", data);

      req.body.user = data;

      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

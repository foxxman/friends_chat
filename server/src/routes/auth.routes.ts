import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import tokenService, { IdbToken } from "../services/token.service.js";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser {
  _id: Types.ObjectId;
  password: "string";
  login: "string";
}

const router = express.Router({ mergeParams: true });

router.post("/signUp", [
  check("password", "Minimum password's length is 8").isLength({ min: 8 }),
  check("login", "Minimum login length is 5").isLength({ min: 5 }),

  async (req: Request, res: Response) => {
    // console.log(req.body);

    //проверка ошибок валидации
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: "INVALID_DATA",
          code: 400,
          errors: errors.array(),
        },
      });
    }

    try {
      const { login, password } = req.body;

      const existingUser = await User.findOne({ login });

      if (existingUser) {
        return res.status(400).json({
          error: {
            message: "LOGIN_EXISTS",
            code: 400,
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });

      const tokens = tokenService.generate({ _id: newUser._id });
      if (!tokens) {
        console.log("TOKENS ERROR");
        return;
      }
      await tokenService.save({ userId: newUser._id, refreshToken: tokens.refreshToken });

      //201 - все ОК, нечто было создано
      res.status(201).send({ ...tokens, userId: newUser._id, login: newUser.login });
    } catch (error: any) {
      res.status(500).json({
        message: "Register Error: " + error.message,
      });
    }
  },
]);

router.post("/signInWithPassword", [
  check("password", "Empty password").exists(),
  check("login", "Empty login").exists(),

  async (req: Request, res: Response) => {
    console.log("login request");

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: "INVALID_DATA",
            code: 400,
          },
        });
      }

      // console.log(req.body);

      const { login, password } = req.body;

      //находим юзера по Email
      const existingUser: IUser | null = await User.findOne({ login });
      if (!existingUser) {
        return res.status(400).send({
          error: {
            message: "LOGIN_NOT_FOUND",
            code: 400,
          },
        });
      }

      //сравниваем зашифрованные пароли
      const isPasswordEqual = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordEqual) {
        return res.status(400).send({
          error: {
            message: "INVALID_PASSWORD",
            code: 400,
          },
        });
      }

      const tokens = tokenService.generate({ _id: existingUser._id });
      if (!tokens) {
        console.log("TOKENS ERROR");
        return;
      }

      await tokenService.save({ userId: existingUser._id, refreshToken: tokens.refreshToken });

      res.status(200).send({ ...tokens, userId: existingUser._id, login });
    } catch (error: any) {
      res.status(500).json({
        message: "Authorization error: " + error.message,
      });
    }
  },
]);

function isTokenInvalid(data: jwt.JwtPayload | null, dbToken: IdbToken | null) {
  return !dbToken || data?._id !== dbToken?.user?.toString();
}

router.post("/token", async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const data = await tokenService.validateRefresh(refreshToken);

    const dbToken = await tokenService.findToken(refreshToken);

    if (!data || typeof data === "string" || isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: "Unautorized" });
    }

    const tokens = tokenService.generate({
      _id: data._id,
    });
    if (!tokens) {
      console.log("TOKENS ERROR");
      return;
    }

    await tokenService.save({ userId: data._id, refreshToken: tokens.refreshToken });

    const tokenUser = await User.findById(data._id);

    if (tokenUser && tokenUser.login) {
      res.status(200).send({ ...tokens, userId: data._id, login: tokenUser.login });
    } else {
      res.status(500).json({
        message: "Unknow server error",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Unknow server error",
    });
  }
});

export default router;

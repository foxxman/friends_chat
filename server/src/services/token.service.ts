import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

interface IGenerate {
  _id: Types.ObjectId;
}

interface ISave {
  userId: Types.ObjectId;
  refreshToken: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IdbToken {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  refreshToken: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

class TokenService {
  //return accessToken, refreshToken, expiresIn
  generate(payload: IGenerate): ITokens | null {
    if (!process.env.refreshSecret || !process.env.accessSecret) return null;

    const accessToken = jwt.sign(payload, process.env.accessSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.refreshSecret);

    return { accessToken, refreshToken, expiresIn: 3600 };
  }

  async save({ userId, refreshToken }: ISave) {
    const data = await Token.findOne({ user: userId });

    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }

    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  async validateRefresh(refreshToken: string): Promise<jwt.JwtPayload | null | string> {
    try {
      if (process.env.refreshSecret) return jwt.verify(refreshToken, process.env.refreshSecret);
      else return null;
    } catch (e) {
      return null;
    }
  }

  async validateAccess(accessToken: string) {
    if (!process.env.accessSecret) return null;

    try {
      return jwt.verify(accessToken, process.env.accessSecret);
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string): Promise<IdbToken | null> {
    try {
      return await Token.findOne({ refreshToken });
    } catch (e) {
      return null;
    }
  }
}

export default new TokenService();

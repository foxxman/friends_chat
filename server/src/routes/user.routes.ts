import express, { Request, Response } from "express";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userData = await User.findById(userId);

    res.send({ login: userData?.login, _id: userData?._id });
  } catch (error) {
    res.status(500).json({
      message: "USER_NOT_FOUND",
    });
  }
});

router.get("/getByLogin/:login", async (req: Request, res: Response) => {
  // const { login } = req.body;
  const { login } = req.params;

  const regex = new RegExp(login);

  try {
    const users = await User.find({ login: regex });

    res.send({ users });
  } catch (error) {
    console.log("error: ", error);
    res.send({ users: [] });
  }
});

export default router;

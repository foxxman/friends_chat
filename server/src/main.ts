import { WebSocket } from "ws";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chalk from "chalk";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import expressWs from "express-ws";
import wsFunc, { wsSession } from "./routes/ws.routes.js";

const { app, getWss } = expressWs(express());
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", routes);

app.ws("/", (ws: wsSession) => wsFunc(ws, getWss()));

const PORT = process.env.PORT ?? 8080;

async function start() {
  try {
    if (!process.env.mongoUri) return;
    await mongoose.connect(process.env.mongoUri);
    console.log(chalk.green(`MongoDB connected`));

    app.listen(PORT, () => {
      console.log(chalk.green(`Server has been started on port ${PORT}...`));
    });
  } catch (e: any) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }
}

start();

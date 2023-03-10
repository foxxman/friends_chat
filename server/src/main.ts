import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import chalk from "chalk";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import expressWs from "express-ws";
import wsFunc, { wsSession } from "./routes/ws.routes.js";
import path from "path";
import { fileURLToPath } from "url";
// cd client && npm i && npm run build && cd ../server && npm i && cd .. && cp client/build server/client -R && cd server && npm start

//  docker buildx build -t friends_chat .
//  docker run -d -p 3001:3001 --name friends_chat --rm  friends_chat
// docker container stop friends_chat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { app, getWss } = expressWs(express());
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", routes);

app.ws("/", (ws: wsSession) => wsFunc(ws, getWss()));

const PORT = process.env.PORT ?? 3001;

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "../client/")));

  const indexPath = path.join(__dirname, "../client/", "index.html");

  app.get("*", (req, res) => res.sendFile(indexPath));
}

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

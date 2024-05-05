import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import {
  BASE_URL_MESSAGE_SERVICE,
  BASE_URL_AUTH_SERVICE,
  PORT,
} from "./lib/config";
import axios from "axios";

dotenv.parse("./env");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

async function getAllMessage(
  id: string | null = null,
  createdAt: string | null = null
) {
  return await axios.get(BASE_URL_MESSAGE_SERVICE + "/messages", {
    params: {
      id,
      createdAt,
    },
  });
}

app.get("/", async (req, res) => {
  await getAllMessage()
    .then((data) => res.json(data.data))
    .catch((err) => console.error(err));
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

type MessageType = {
  message: string;
  rootId?: string;
  parentId?: string;
};
io.on("connection", async (socket) => {
  console.log("[INFO] User Connected");
  const auth = socket.client.request.headers.authorization;
  if (!auth) {
    console.error("[ERROR] Token Not Found");
    socket.emit("error", "Token Not Found");
    socket.disconnect();
  }

  await axios.get(BASE_URL_AUTH_SERVICE + "/check-token/" + auth).catch(() => {
    console.error("[ERROR] Token Not Valid");
    socket.emit("error", "Token Not Valid");
    socket.disconnect();
  });

  await getAllMessage()
    .then((data) => socket.emit("message", data.data))
    .catch((err) => console.error(err));

  socket.on("pagination", async (params) => {
    console.log(params);
    await getAllMessage(params.id, params.createdAt)
      .then((data) => {
        socket.emit("pagination", data.data);
      })
      .catch((err) => socket.emit("error", err));
  });

  socket.on("message", async (msg: MessageType, params) => {
    await axios
      .post(BASE_URL_MESSAGE_SERVICE + "/message", msg, {
        headers: {
          Authorization: "Bearer " + auth,
        },
      })
      .then((data) => {
        socket.broadcast.emit("new-message", data.data.data);
      })
      .catch((err) => console.error(err));
  });
});

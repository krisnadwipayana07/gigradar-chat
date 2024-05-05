import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { PORT } from "./lib/config";

dotenv.config({ path: "../.env" });

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("message", (msg, params) => {
    console.log(params);
    console.log("message: " + msg);
    socket.broadcast.emit("message", { message: "bro tess: " + msg });
  });
});

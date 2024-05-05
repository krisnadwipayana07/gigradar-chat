import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PORT } from "./lib/config";
import { connectDatabase } from "./lib/db";
import { getTokenData, verifyToken } from "./lib/token";
import {
  NextCursor,
  getAllMessage,
  getMessage,
  insertMessage,
} from "./services/message";
import { ObjectId } from "mongodb";

dotenv.parse("./env");
const app: Express = express();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Ping Success", time: new Date() });
});

app.get("/messages", async (req: Request, res: Response) => {
  const cursor: NextCursor = {
    createdAt: req.query["createdAt"]
      ? new Date(req.query["createdAt"] as string)
      : new Date("0000-01-01"),
    id: req.query["id"]
      ? new ObjectId(req.query["id"] as string)
      : new ObjectId("000000000000000000000000"),
  };
  console.log(cursor);
  const message = await getAllMessage(cursor);
  if (message == null)
    return res.status(404).json({ message: "Message Not Found" });

  res.status(200).json(message);
});

app.post("/message", verifyToken, async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  const token = getTokenData(req);

  const id = await insertMessage(
    data.message,
    token.userId,
    data.rootId,
    data.parentId
  );
  if (id == null)
    return res.status(500).json({ message: "Error Insert Message" });

  const message = await getMessage(id.insertedId);
  res.status(201).json({
    message: "Message created successfully",
    data: message,
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

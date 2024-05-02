import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PORT, SECRET } from "./lib/config";
import { connectDatabase } from "./lib/db";
import { getTokenData, verifyToken } from "./lib/token";
import { getAllMessage, insertMessage } from "./services/message";

dotenv.parse("./env");
const app: Express = express();
app.use(bodyParser.json());

app.get("/messages", verifyToken, async (req: Request, res: Response) => {
  const message = await getAllMessage();
  if (message == null)
    return res.status(404).json({ message: "Message Not Found" });

  res.status(200).json({
    data: message,
  });
});

app.post("/message", verifyToken, async (req: Request, res: Response) => {
  const data = req.body;
  const token = getTokenData(req);
  const id = await insertMessage(data.message, token.userId);
  if (id == null)
    return res.status(500).json({ message: "Error Insert Message" });
  res.status(201).json({
    message: "Message created successfully",
    id: id,
  });
});

app.post("/message/reply", verifyToken, async (req: Request, res: Response) => {
  const data = req.body;

  const token = getTokenData(req);

  const id = await insertMessage(
    data.message,
    token.userId,
    data.rootId,
    data.parentId
  );
  if (id == null)
    return res.status(500).json({ message: "Error Insert Message" });
  res.status(201).json({
    message: "Message created successfully",
    id: id,
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

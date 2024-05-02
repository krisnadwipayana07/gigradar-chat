import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PORT } from "./lib/config";
import { connectDatabase, db } from "./lib/db";
import {
  changeUserPassword,
  deleteUser,
  getAllUser,
  getUserByID,
  getUserByUsername,
  insertUser,
  updateUser,
} from "./services/user";
import { getTokenData } from "./lib/token";
import { comparePassword } from "./lib/hash";

dotenv.config({ path: "./env" });

const app: Express = express();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Ping Success", time: new Date() });
});

app.post("/user", async (req: Request, res: Response) => {
  const data = req.body;

  const user = await getUserByUsername(data.username);
  if (user) return res.status(400).json({ message: "Username already exists" });

  const id = await insertUser(data);
  if (id == null) return res.status(500).json({ message: "Error Insert User" });

  res.status(201).json({
    message: "User created successfully",
    id: id,
  });
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await getAllUser();
  if (users == null) return res.status(404).json({ message: "User not found" });

  res.json(users);
});

app.get("/user/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user = await getUserByID(id);
  if (user == null) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

app.put("/user/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user = await getUserByID(id);
  if (user == null) return res.status(404).json({ message: "User not found" });

  const data = req.body;
  const update = await updateUser(data, id);
  if (update == null)
    return res.status(500).json({ message: "Error Update User" });

  return res.json({
    message: "User updated successfully",
    id: id,
  });
});

app.delete("/user/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user = await getUserByID(id);
  if (user == null) return res.status(404).json({ message: "User not found" });

  const update = await deleteUser(id);
  if (update == null)
    return res.status(500).json({ message: "Error Delete User" });

  return res.json({
    message: "User deleted successfully",
    id: id,
  });
});

app.post("/user/change-password", async (req: Request, res: Response) => {
  const token = getTokenData(req);

  const data = req.body;
  const user = await getUserByID(token.userId);
  if (user == null) return res.status(404).json({ message: "User not found" });

  const compare = await comparePassword(data.password, user.password);
  if (!compare) return res.status(404).json({ message: "Invalid Password" });

  const update = await changeUserPassword(token.userId, data.newPassword);
  if (update == null)
    return res.status(500).json({ message: "Error Update User" });

  return res.json({
    message: "Password updated successfully",
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

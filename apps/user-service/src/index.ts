import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDatabase, db } from "../lib/db";
import { PORT } from "../lib/config";
import { hashPassword } from "../lib/hash";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import {
  deleteUser,
  getAllUser,
  getUserByID,
  insertUser,
  updateUser,
} from "../services/user";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const user = db.collection("users");

app.post("/user", async (req: Request, res: Response) => {
  const data = req.body;
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

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

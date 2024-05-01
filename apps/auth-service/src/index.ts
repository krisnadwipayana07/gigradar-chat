import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PORT, SECRET } from "./lib/config";
import { connectDatabase } from "./lib/db";
import { getUserByUsername } from "./services/user";
import { comparePassword } from "./lib/hash";
import { generateToken } from "./lib/token";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

app.post("/auth", async (req: Request, res: Response) => {
  const data = req.body;
  const user = await getUserByUsername(data.username);
  if (user == null)
    return res.status(404).json({ message: "Invalid Username or Password" });

  const match = await comparePassword(data.password, user.password);
  if (!match)
    return res.status(404).json({ message: "Invalid Username or Password" });

  const token = generateToken(user._id.toString());

  res.status(200).json({
    message: "Auth created successfully",
    data: {
      ...user,
      token,
    },
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

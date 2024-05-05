import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PORT } from "./lib/config";
import { connectDatabase } from "./lib/db";
import { getUserByUsername } from "./services/user";
import { comparePassword } from "./lib/hash";
import { generateToken, getTokenData, verifyToken } from "./lib/token";
import cors from "cors";

dotenv.config({ path: "./env" });

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Ping Success", time: new Date() });
});

app.post("/auth", async (req: Request, res: Response) => {
  const data = req.body;
  const user = await getUserByUsername(data.username);
  if (user == null) {
    console.error("[service] User not found");
    return res.status(404).json({ message: "Invalid Username or Password" });
  }

  const match = await comparePassword(data.password, user.password);
  if (!match) {
    console.error("[service] Password Not Match", data.password, user.password);
    return res.status(404).json({ message: "Invalid Username or Password" });
  }

  const token = generateToken(user._id.toString());
  return res.status(200).json({
    message: "Login Success",
    data: {
      ...user,
      token,
    },
  });
});

app.get("/check-token/:token", async (req: Request, res: Response) => {
  console.info("[Request] Check Token", req.params.token);
  const token = req.params.token;
  if (!token) {
    console.error("[Request] Token Not Found");
    return res.status(404).json({ message: "Token Not Found" });
  }

  const verif = verifyToken(token);
  if (!verif) {
    console.error("[Service] Invalid Token");
    return res.status(400).json({ message: "Invalid Token" });
  }

  const data = getTokenData(token);
  console.info("[INFO] Token Verified", data);
  res.json({
    message: "Token Verified",
    data,
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

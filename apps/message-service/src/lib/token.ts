import jwt from "jsonwebtoken";
import { SECRET } from "./config";
import { NextFunction, Request, Response } from "express";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const pureToken = token.split(" ")[1] ?? "";
  jwt.verify(pureToken, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    next();
  });
}

type TokenType = {
  userId: string;
};

export function getTokenData(req: Request): TokenType {
  let token = req.headers["authorization"];

  if (!token) {
    return { userId: "" };
  }

  const pureToken = token.split(" ")[1] ?? "";
  const data = jwt.decode(pureToken);
  return data as TokenType;
}

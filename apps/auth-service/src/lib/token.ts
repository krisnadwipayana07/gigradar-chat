import jwt from "jsonwebtoken";
import { SECRET } from "./config";
import { NextFunction, Request, Response } from "express";

export function generateToken(id: string) {
  return jwt.sign(
    {
      userId: id,
    },
    SECRET,
    { expiresIn: "1h" }
  );
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

type TokenType = {
  userId: string;
};

export function getTokenData(token: string): TokenType {
  const data = jwt.decode(token);
  return data as TokenType;
}

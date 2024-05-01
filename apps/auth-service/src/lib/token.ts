import jwt from "jsonwebtoken";
import { SECRET } from "./config";

export function generateToken(id: string) {
  return jwt.sign(
    {
      userId: id,
    },
    SECRET,
    { expiresIn: "1h" }
  );
}

import { ObjectId } from "mongodb";
import { hashPassword } from "../lib/hash";
import { user } from "../models";

type User = {
  username: string;
  password: string;
};

const filterIsNotDeleted = {
  deletedAt: { $exists: false },
};

export async function getUserByUsername(username: string) {
  const data = await user.findOne({
    username: username,
    ...filterIsNotDeleted,
  });
  return data;
}

import { ObjectId } from "mongodb";
import { hashPassword } from "../lib/hash";
import { user } from "../models";

export type User = {
  username: string;
  email: string;
  password: string;
};

const filterIsNotDeleted = {
  deletedAt: { $exists: false },
};
export async function insertUser(data: User) {
  const insert = await user.insertOne({
    ...data,
    password: await hashPassword(data.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (insert.insertedId == null) return null;
  console.error("[service] Error Insert User");
  return insert.insertedId;
}

export async function getUserByID(id: string) {
  const data = await user.findOne({
    _id: new ObjectId(id),
    ...filterIsNotDeleted,
  });
  return data;
}

export async function getAllUser() {
  const data = await user.find({}).toArray();
  return data;
}

export async function updateUser(data: User, id: string) {
  const update = await user.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  return update;
}

export async function deleteUser(id: string) {
  const update = await user.updateOne(
    { _id: new ObjectId(id) },
    { $set: { deletedAt: new Date() } }
  );
  return update;
}

export async function changeUserPassword(id: string, password: string) {
  const update = await user.updateOne(
    { _id: new ObjectId(id) },
    { $set: { password: await hashPassword(password) } }
  );
  return update;
}

export async function getUserByUsername(username: string) {
  const data = await user.findOne({
    username: username,
    ...filterIsNotDeleted,
  });
  return data;
}

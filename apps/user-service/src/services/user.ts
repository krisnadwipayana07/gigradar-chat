import { Filter, ObjectId } from "mongodb";
import { hashPassword } from "../lib/hash";
import { user } from "../models";

type User = {
  username: string;
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

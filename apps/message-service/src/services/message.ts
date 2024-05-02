import { ObjectId } from "mongodb";
import { message } from "../models";

export async function getAllMessage() {
  const result = message.find({});
  return result.toArray();
}

export async function insertMessage(
  data: string,
  senderId: string,
  rootId?: string,
  parentId?: string
) {
  const _id = new ObjectId();
  const result = message.insertOne({
    _id,
    senderId,
    rootId: rootId ?? _id.toString(),
    message: data,
    parentId,
    createdAt: new Date(),
  });

  return result;
}

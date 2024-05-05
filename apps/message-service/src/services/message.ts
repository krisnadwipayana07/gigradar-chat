import { ObjectId } from "mongodb";
import { message } from "../models";

/**
 * testingg
 * test
 */
export type NextCursor = {
  createdAt: Date;
  id: ObjectId;
};
export async function getAllMessage(cursor: NextCursor | null = null) {
  const limit = 25 + 1;
  if (!cursor) {
    cursor = {
      createdAt: new Date("2024-01-01"),
      id: new ObjectId("000000000000000000000000"),
    };
  }

  if (cursor && cursor.createdAt == undefined) {
    cursor.createdAt = new Date("2024-01-01");
  }

  const result = message.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $match: {
        createdAt: {
          $gte: cursor?.createdAt,
        },
        _id: {
          $gte: new ObjectId(cursor?.id),
        },
      },
    },
    {
      $sort: {
        createdAt: 1,
        id: 1,
      },
    },
    {
      $limit: limit,
    },
  ]);
  const data = await result.toArray();
  const last = data.length == limit ? data.pop() : null;
  return {
    data,
    nextCursor:
      last != null
        ? {
            createdAt: last?.createdAt,
            id: last?._id.toString(),
          }
        : null,
  };
}
export async function getMessage(id: ObjectId) {
  const result = message.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $match: {
        _id: id,
      },
    },
  ]);
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
    senderId: senderId ? new ObjectId(senderId) : null,
    rootId: rootId ?? _id.toString(),
    message: data,
    parentId,
    createdAt: new Date(),
  });

  return result;
}

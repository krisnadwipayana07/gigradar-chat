import { MongoClient } from "mongodb";

import { MONGODB_DATABASE, MONGODB_URL } from "../lib/config";

const client = new MongoClient(MONGODB_URL);
export const db = client.db(MONGODB_DATABASE);

export async function connectDatabase() {
  await client.connect();
  console.log("Connected to MongoDB");
}

export async function closeDatabase() {
  await client.close();
}

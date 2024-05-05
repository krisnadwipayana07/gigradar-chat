import { MongoClient } from "mongodb";

import { MONGODB_DATABASE, MONGODB_URL } from "./config";

const client = new MongoClient(MONGODB_URL);
export const db = client.db(MONGODB_DATABASE);

export async function connectDatabase() {
  console.log(MONGODB_URL);
  await client.connect();
  console.log("Connected to MongoDB");
}

export async function closeDatabase() {
  await client.close();
}

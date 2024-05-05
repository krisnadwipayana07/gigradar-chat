export const ENVIRONMENT = process.env.ENVIRONMENT ?? "development";
export const IS_PRODUCTION = ENVIRONMENT === "production";
export const PORT = Number(process.env.PORT ?? 3020);

export const MONGODB_URL =
  process.env.MONGODB_URL ?? "mongodb://localhost:27017/chat";
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? "chat";

export const SECRET = process.env.SECRET ?? "chat";

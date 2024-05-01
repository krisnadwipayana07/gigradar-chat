export const ENVIRONMENT = process.env.ENVIRONMENT ?? "development";
export const IS_PRODUCTION = ENVIRONMENT === "production";
export const PORT = Number(process.env.PORT ?? 3030);

export const MONGODB_URL =
  process.env.MONGODB_URL ?? "mongodb://127.0.0.1:27017/wwwaste";
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? "wwwaste";

export const NATS_URL = process.env.NATS_URL ?? "nats://127.0.0.1:4222";

export const JWT_SECRET = process.env.JWT_SECRET ?? "wwwastesecret";

export const API_URL = process.env.API_URL ?? "http://localhost:3030";
export const PORTAL_URL = process.env.PORTAL_URL ?? "http://localhost:3031";

import bycrpt from "bcrypt";

export async function hashPassword(password: string) {
  return await bycrpt.hash(password, 10);
}

export async function comparePassword(password: string, hashPassword: string) {
  return await bycrpt.compare(password, hashPassword);
}

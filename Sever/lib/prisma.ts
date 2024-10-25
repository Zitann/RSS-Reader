import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var -- this is a global variable
  var client: PrismaClient | undefined;
}

export const prisma = globalThis.client || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.client = prisma;
}

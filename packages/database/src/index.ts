import { PrismaClient } from "@prisma/client";

const globalObj: {
  prisma?: PrismaClient;
} = globalThis as any;

export const prisma = globalObj.prisma || new PrismaClient();

export * from "@prisma/client";

//

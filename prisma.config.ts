import "dotenv/config";
import { env } from "prisma/config";
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl = env("DATABASE_URL");
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};

import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

// Configure Neon to use WebSockets
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

console.info("DATABASE_URL", process.env.DATABASE_URL);

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({ adapter });
} else {
  console.info("DEV MODE");
  if (!global.cachedPrisma) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    const adapter = new PrismaNeon(pool);
    global.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

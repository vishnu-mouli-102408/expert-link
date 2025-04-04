import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

import env from "./env";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

// Configure Neon to use WebSockets
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

let prisma: PrismaClient;

// console.log("NODE_ENV", env.NODE_ENV);
// console.log("DATABASE_URL", env.DATABASE_URL);

if (env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.cachedPrisma) {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
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

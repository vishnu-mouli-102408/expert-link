import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { HTTPException } from "hono/http-exception";
import { jstack } from "jstack";

interface Env {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Bindings: {};
}

export const j = jstack.init<Env>();

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */

const authMiddleware = j.middleware(async ({ c, next }) => {
  const auth = await currentUser();

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next({ user });
});

export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);

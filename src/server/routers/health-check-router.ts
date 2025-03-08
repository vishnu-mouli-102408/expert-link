import { OK } from "@/lib/http-status-codes";

import { j, publicProcedure } from "../jstack";

export const healthCheckRouter = j.router({
  healthCheck: publicProcedure.query(async ({ c }) => {
    return c.json({
      message: "Server is up and running",
      success: true,
      code: OK,
    });
  }),
});

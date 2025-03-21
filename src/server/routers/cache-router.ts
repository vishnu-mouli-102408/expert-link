import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes";
import { logger } from "@/lib/logger";
import { memoryCache } from "@/lib/memory-cache";

import { j, privateProcedure, publicProcedure } from "../jstack";

export const cacheRouter = j.router({
  cacheStats: privateProcedure.query(async ({ c }) => {
    try {
      // Get memory cache size
      const memoryCacheSize = memoryCache.size();

      return c.json({
        success: true,
        message: "Cache stats retrieved successfully",
        data: {
          memoryCache: {
            size: memoryCacheSize,
          },
        },
        code: OK,
      });
    } catch (error) {
      logger.error({ error }, "Error fetching cache stats");
      return c.json({
        message: "Failed to retrieve cache stats",
        success: false,
        data: null,
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }),

  // Manually trigger memory cache GC
  runCacheGC: publicProcedure.mutation(async ({ c }) => {
    try {
      const deletedCount = memoryCache.runGC();

      return c.json({
        success: true,
        message: "Memory cache garbage collection completed",
        data: {
          deletedEntries: deletedCount,
        },
        code: OK,
      });
    } catch (error) {
      logger.error({ error }, "Error running cache garbage collection");
      return c.json({
        message: "Failed to run garbage collection",
        success: false,
        data: null,
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }),
});

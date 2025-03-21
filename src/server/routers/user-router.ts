import { db } from "@/db";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import type { ApiResponse, SearchExpertsResult } from "@/types/common";
import {
  INTERNAL_SERVER_ERROR,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  OK,
} from "@/lib/http-status-codes";
import { logger } from "@/lib/logger";
import { memoryCache } from "@/lib/memory-cache";
import { redis } from "@/lib/redis";

import { j, privateProcedure } from "../jstack";

export const userRouter = j.router({
  // Get user analytics
  getUserAnalytics: privateProcedure
    .input(
      z
        .object({
          filter: z
            .object({
              type: z
                .enum(["7days", "30days", "90days", "thisyear"])
                .optional()
                .nullable(),
            })
            .optional(),
        })
        .optional()
    )
    .query(async ({ c, ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { filter: { type = "7days" } = {} } = input || {};
        if (!userId) {
          return c.json({
            message: "User not found",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }

        const dateRanges = {
          "7days": 7,
          "30days": 30,
          "90days": 90,
          thisyear: 365,
        };

        const days = dateRanges[type ?? "7days"] || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        logger.info({ startDate }, "START DATE");

        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - days);

        logger.info({ prevStartDate }, "PREV START DATE");

        // Execute all database queries in parallel using Promise.all
        const [
          totalCalls,
          previousTotalCalls,
          activeExperts,
          previousActiveExperts,
          avgCallDuration,
          previousAvgCallDuration,
          communicationActivity,
          messagesActivity,
          upcomingCalls,
          previousUpcomingCalls,
          recentCalls,
        ] = await Promise.allSettled([
          // SECTION 1: CALL ANALYTICS
          // Total calls
          db.call.count({
            where: {
              userId,
              startedAt: { gte: startDate },
            },
          }),

          // Previous total calls
          db.call.count({
            where: {
              userId,
              startedAt: { gte: prevStartDate },
            },
          }),

          // Active experts (who had calls)
          db.call.groupBy({
            by: ["expertId"],
            where: {
              userId,
              startedAt: { gte: startDate },
            },
            _count: {
              expertId: true,
            },
          }),

          // Previous active experts
          db.call.groupBy({
            by: ["expertId"],
            where: {
              userId,
              startedAt: { gte: prevStartDate, lt: startDate },
            },
            _count: {
              expertId: true,
            },
          }),

          // Average call duration
          db.call.aggregate({
            _avg: { duration: true },
            where: {
              userId,
              startedAt: { gte: startDate },
            },
          }),

          // Previous average call duration
          db.call.aggregate({
            _avg: { duration: true },
            where: {
              userId,
              startedAt: { gte: prevStartDate, lt: startDate },
            },
          }),

          // SECTION 2: COMMUNICATION ACTIVITY (Calls per day)
          db.call.groupBy({
            by: ["startedAt", "callType"],
            where: {
              userId,
              startedAt: { gte: startDate },
            },
            _count: {
              id: true,
            },
          }),

          db.message.groupBy({
            by: ["sentAt"],
            where: {
              senderId: userId,
              receiverId: userId,
              sentAt: { gte: startDate },
            },
            _count: {
              id: true,
            },
          }),

          // SECTION 3: UPCOMING CALLS
          db.scheduledCall.findMany({
            where: {
              userId,
              status: "CONFIRMED",
              scheduledAt: { gte: new Date() },
            },
            select: {
              id: true,
              scheduledAt: true,
              callType: true,
              duration: true,
              expert: {
                select: {
                  firstName: true,
                  lastName: true,
                  expertise: true,
                  profilePic: true,
                },
              },
            },
            orderBy: { scheduledAt: "asc" },
          }),

          // Previous upcoming calls
          db.scheduledCall.count({
            where: {
              userId,
              status: "CONFIRMED",
              scheduledAt: { gte: prevStartDate, lt: startDate },
            },
          }),

          // SECTION 4: RECENT CALL HISTORY
          db.call.findMany({
            where: {
              userId,
            },
            select: {
              id: true,
              startedAt: true,
              duration: true,
              status: true,
              callType: true,
              expert: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: { startedAt: "desc" },
            take: 5,
          }),
        ]);

        // Log results
        logger.info({ totalCalls }, "TOTAL CALLS");
        logger.info({ previousTotalCalls }, "PREVIOUS TOTAL CALLS");

        // Calculate derived metrics
        const totalActiveExperts =
          activeExperts.status === "fulfilled" ? activeExperts.value.length : 0;
        const prevTotalActiveExperts =
          previousActiveExperts.status === "fulfilled"
            ? previousActiveExperts.value.length
            : 0;
        const totalUpcomingCalls =
          upcomingCalls.status === "fulfilled" ? upcomingCalls.value.length : 0;
        const avgCallDurationValue =
          avgCallDuration.status === "fulfilled"
            ? avgCallDuration.value._avg.duration
            : 0;
        const previousAvgCallDurationValue =
          previousAvgCallDuration.status === "fulfilled"
            ? previousAvgCallDuration.value._avg.duration
            : 0;

        const callPercentageChange =
          previousTotalCalls.status === "fulfilled" &&
          totalCalls.status === "fulfilled"
            ? previousTotalCalls.value === 0
              ? 0
              : ((totalCalls.value - previousTotalCalls.value) /
                  previousTotalCalls.value) *
                100
            : 0;

        const expertPercentageChange =
          prevTotalActiveExperts === 0
            ? 0
            : ((totalActiveExperts - prevTotalActiveExperts) /
                prevTotalActiveExperts) *
              100;

        const callDurationPercentageChange =
          previousAvgCallDurationValue === 0
            ? 0
            : (((avgCallDurationValue ?? 0) -
                (previousAvgCallDurationValue ?? 0)) /
                (previousAvgCallDurationValue ?? 0)) *
              100;

        const upcomingCallsPercentageChange =
          previousUpcomingCalls.status === "fulfilled"
            ? previousUpcomingCalls.value === 0
              ? 0
              : ((totalUpcomingCalls - previousUpcomingCalls.value) /
                  previousUpcomingCalls.value) *
                100
            : 0;

        // Format activity by day
        const activityByDay: Record<
          string,
          { audio_calls: number; video_calls: number; text_messages: number }
        > = {};

        // 🟢 Process communication (audio/video calls)
        if (communicationActivity.status === "fulfilled") {
          communicationActivity.value.forEach((data) => {
            if (!data.startedAt) return; // Ensure date exists
            const day = new Intl.DateTimeFormat("en-US", {
              weekday: "short",
            }).format(data.startedAt); // Convert to "Mon", "Tue", etc.

            if (!activityByDay[day])
              activityByDay[day] = {
                video_calls: 0,
                audio_calls: 0,
                text_messages: 0,
              };

            if (data.callType === "AUDIO")
              activityByDay[day].audio_calls += data._count.id;
            if (data.callType === "VIDEO")
              activityByDay[day].video_calls += data._count.id;
          });
        } else {
          logger.error(
            { communicationActivity },
            "Error fetching communication activity"
          );
        }

        // 🟢 Process messages
        if (messagesActivity.status === "fulfilled") {
          messagesActivity.value.forEach((data) => {
            if (!data.sentAt) return; // Ensure date exists
            const day = new Intl.DateTimeFormat("en-US", {
              weekday: "short",
            }).format(data.sentAt); // Convert to "Mon", "Tue", etc.

            if (!activityByDay[day])
              activityByDay[day] = {
                video_calls: 0,
                audio_calls: 0,
                text_messages: 0,
              };

            activityByDay[day].text_messages += data._count.id;
          });
        } else {
          logger.error(
            { messagesActivity },
            "Error fetching messages activity"
          );
        }

        // 🟢 Convert object to array with required format
        const activityArray = Object.keys(activityByDay).map((day) => ({
          day, // "Mon", "Tue", etc.
          ...activityByDay[day],
        }));

        // Log additional information
        logger.info({ callPercentageChange }, "CALL PERCENTAGE CHANGE");
        logger.info({ totalActiveExperts }, "TOTAL ACTIVE EXPERTS");
        logger.info({ expertPercentageChange }, "EXPERT PERCENTAGE CHANGE");
        logger.info({ avgCallDurationValue }, "AVG CALL DURATION VALUE");
        logger.info(
          { callDurationPercentageChange },
          "CALL DURATION PERCENTAGE CHANGE"
        );
        logger.info({ activityByDay }, "ACTIVITY BY DAY");
        logger.info({ activityArray }, "ACTIVITY ARRAY");
        logger.info({ totalUpcomingCalls }, "TOTAL UPCOMING CALLS");
        logger.info(
          { upcomingCallsPercentageChange },
          "UPCOMING CALLS PERCENTAGE CHANGE"
        );

        return c.superjson({
          message: "User analytics fetched successfully",
          success: true,
          code: OK,
          data: {
            analytics: {
              totalCalls: {
                totalCalls:
                  totalCalls.status === "fulfilled" ? totalCalls.value : 0,
                callPercentageChange: callPercentageChange,
              },
              activeExperts: {
                totalActiveExperts,
                expertPercentageChange,
              },
              averageCallDuration: {
                avgCallDurationValue,
                callDurationPercentageChange,
              },
              upcomingCalls: {
                totalUpcomingCalls,
                upcomingCallsPercentageChange,
              },
            },
            activityArray,
            upcomingCalls:
              upcomingCalls.status === "fulfilled" ? upcomingCalls.value : [],
            recentCalls:
              recentCalls.status === "fulfilled" ? recentCalls.value : [],
          },
        });
      } catch (error) {
        logger.error("Error fetching user analytics", error);
        return c.json({
          message: "Internal server error",
          success: false,
          data: null,
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }),

  // Get all experts
  getAllExperts: privateProcedure
    .input(
      z
        .object({
          page: z.number().int().optional(),
          limit: z.number().int().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ c, ctx, input }) => {
      try {
        const { page = 1, limit = 10, search = "" } = input || {};
        const offset = ((page ?? 1) - 1) * (limit ?? 10);

        logger.info({ page, limit, search }, "Query parameters");

        let whereCondition = {};
        if (search?.trim() !== "") {
          whereCondition = {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { expertise: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          };
        }

        const [total, experts] = await Promise.all([
          db.user.count({ where: { ...whereCondition, role: "EXPERT" } }),
          db.user.findMany({
            where: { ...whereCondition, role: "EXPERT" },
            skip: offset,
            take: limit ?? 10,
            orderBy: { createdAt: "desc" },
            include: {
              reviewsReceived: true,
            },
          }),
        ]);

        const expertsWithAvgRating = experts.map((expert) => {
          const totalRatings = expert.reviewsReceived.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const avgRating =
            expert.reviewsReceived.length > 0
              ? totalRatings / expert.reviewsReceived.length
              : 0;
          return {
            ...expert,
            avgRating,
            totalReviews: expert.reviewsReceived.length,
          };
        });

        return c.json({
          message: "Experts fetched successfully",
          success: true,
          data: {
            totalExperts: total,
            experts: expertsWithAvgRating,
            currentPage: page,
            totalPages: Math.ceil(total / (limit ?? 10)),
          },
          code: OK,
        });
      } catch (error) {
        logger.error({ error }, "Error fetching experts");
        return c.json({
          message: "Internal server error",
          success: false,
          data: null,
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }),

  // Get expert by ID
  getExpertById: privateProcedure
    .input(
      z.object({
        expertId: z.string(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      try {
        const { expertId } = input;
        logger.info({ expertId }, "Expert ID");
        if (!expertId) {
          return c.json({
            message: "Expert ID is required",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }
        // Fetch expert by ID
        const expert = await db.user.findUnique({
          where: {
            id: expertId,
          },
        });

        logger.info({ expert }, "Expert Data");

        if (!expert) {
          return c.json({
            message: "Expert not found",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }

        // Fetch expert reviews and average rating
        const expertReviews =
          (await db.review.findMany({
            where: {
              expertId: expertId,
            },
            select: {
              comment: true,
              createdAt: true,
              expertId: true,
              id: true,
              rating: true,
              userId: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profilePic: true,
                },
              },
            },
          })) || [];

        logger.info({ expertReviews }, "Expert Reviews");

        // Only run aggregate query if there are reviews
        let rating = 0;
        if (expertReviews.length > 0) {
          const averageRating = await db.review.aggregate({
            where: { expertId: expertId },
            _avg: { rating: true },
          });
          rating = averageRating?._avg?.rating ?? 0;
          logger.info({ averageRating }, "Average");
        }

        return c.json({
          message: "Expert fetched successfully",
          success: true,
          data: {
            expert,
            averageRating: rating,
            reviews: expertReviews,
          },
          code: OK,
        });
      } catch (error) {
        logger.error({ error }, "Error fetching expert by ID");
        return c.json({
          message: "Internal server error",
          success: false,
          data: null,
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }),

  // Get expert reviews
  getExpertReviews: privateProcedure
    .input(
      z.object({
        expertId: z.string(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { expertId } = input;
      logger.info({ expertId }, "Expert ID");
      if (!expertId) {
        return c.json({
          message: "Expert ID is required",
          success: false,
          data: null,
          code: NOT_FOUND,
        });
      }

      const expertReviews = await db.review.findMany({
        where: {
          expertId: expertId,
        },
      });

      return c.json({
        message: "Expert reviews fetched successfully",
        success: true,
        data: expertReviews,
        code: OK,
      });
    }),

  // Write a review for an expert
  writeReviewForExpert: privateProcedure
    .input(
      z.object({
        expertId: z.string(),
        rating: z.number().int().min(1).max(5),
        reviewText: z.string().max(500),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { expertId, rating, reviewText } = input;
      const userId = ctx.user.id;
      logger.info({ expertId, rating, reviewText }, "Review Data");
      if (!expertId || !rating || !reviewText) {
        return c.json({
          message: "Expert ID, rating, and review text are required",
          success: false,
          data: null,
          code: NOT_FOUND,
        });
      }

      // Check if user has already reviewed the expert
      const existingReview = await db?.review?.findFirst({
        where: {
          expertId,
          userId,
        },
      });

      if (existingReview) {
        return c.json({
          message: "You have already reviewed this expert",
          success: false,
          data: null,
          code: NOT_ACCEPTABLE,
        });
      }

      // Create a new review
      const newReview = await db.review.create({
        data: {
          rating,
          comment: reviewText,
          expertId,
          userId,
        },
      });

      return c.json({
        message: "Review submitted successfully",
        success: true,
        data: newReview,
        code: OK,
      });
    }),

  // Search Experts
  searchExperts: privateProcedure
    .input(
      z.object({
        query: z.string().optional(),
        expertise: z.string().optional(),
        skills: z.array(z.string()).optional(),
        minRate: z.number().optional(),
        maxRate: z.number().optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ c, ctx, input }) => {
      try {
        // Cache TTL in seconds
        const CACHE_TTL = 60 * 15; // 15 minutes
        const MEMORY_CACHE_TTL = 60 * 5; // 5 minutes

        const { limit, page, expertise, maxRate, minRate, query, skills } =
          input;

        logger.info({ input }, "Search Experts Input");

        const cacheKey = `expert-search:${JSON.stringify(input)}`;
        logger.info({ cacheKey }, "Cache Key");

        // Try to get from in-memory cache first (faster)
        const memoryResults = memoryCache.get<SearchExpertsResult>(cacheKey);
        logger.info({ memoryResults }, "Memory Results");
        if (memoryResults) {
          logger.info(
            { source: "memory-cache" },
            "Cache hit from in-memory cache"
          );
          return c.json({
            message: "Experts fetched successfully (from memory cache)",
            success: true,
            data: memoryResults,
            code: OK,
          } as ApiResponse<SearchExpertsResult>);
        }

        // Try to get from Redis cache next
        const cachedResults = (await redis.get(
          cacheKey
        )) as SearchExpertsResult | null;
        logger.info({ cachedResults }, "Cached Results from Redis");

        if (cachedResults) {
          return c.json({
            message: "Experts fetched successfully",
            success: true,
            data: cachedResults,
            code: OK,
          } as ApiResponse<SearchExpertsResult>);
        }

        console.log("Cached results not found, fetching from database");

        const where: Prisma.UserWhereInput = {
          role: "EXPERT",
        };

        if (query) {
          where.OR = [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { expertise: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ];
        }

        if (expertise) {
          if (expertise?.toLowerCase() === "all") {
            where.expertise = {
              not: null,
            };
          } else {
            where.expertise = {
              contains: expertise,
              mode: "insensitive",
            };
          }
        }

        if (skills && skills.length > 0) {
          where.skills = {
            hasSome: skills,
          };
        }

        if (minRate || maxRate) {
          where.hourlyRate = {};

          if (minRate) {
            // Convert string hourlyRate to number for comparison
            where.hourlyRate.gte = minRate.toString();
          }

          if (maxRate) {
            where.hourlyRate.lte = maxRate.toString();
          }
        }

        const offset = (page - 1) * limit;

        const [experts, totalCount] = await Promise.all([
          db.user
            .findMany({
              where,
              select: {
                id: true,
                firstName: true,
                lastName: true,
                expertise: true,
                bio: true,
                profilePic: true,
                hourlyRate: true,
                skills: true,
                yearsOfExperience: true,
                certifications: true,
                availability: true,
              },
              skip: offset,
              take: limit,
              orderBy: {
                updatedAt: "desc",
              },
            })
            .then(async (users) => {
              return Promise.all(
                users.map(async (user) => {
                  //   logger.info({ user }, "USER");

                  const avgRating = await db.review.aggregate({
                    where: { expertId: user.id },
                    _avg: { rating: true },
                  });

                  //   logger.info({ avgRating }, "Average Rating");

                  // Fetch count of reviews received
                  const reviewCount = await db.review.count({
                    where: { expertId: user.id },
                  });

                  //   logger.info({ reviewCount }, "Review Count");

                  return {
                    ...user,
                    averageRating: avgRating._avg.rating ?? 0, // Default 0 if no ratings
                    reviewCount, // Total reviews received
                  };
                })
              );
            }),
          db.user.count({ where }),
        ]);

        const result = {
          experts,
          totalCount: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          pageSize: limit,
        };

        logger.info({ totalCount }, "Search Experts Result Found");

        // Store in memory cache
        memoryCache.set(cacheKey, result, MEMORY_CACHE_TTL);

        // Cache the results with Upstash Redis
        await redis.set(cacheKey, result, {
          ex: CACHE_TTL,
        });

        return c.json({
          success: true,
          message: "Experts fetched successfully",
          data: result,
          code: OK,
        } as ApiResponse<SearchExpertsResult>);
      } catch (error) {
        logger.error({ error }, "Error fetching experts");
        return c.json({
          message: "Internal server error",
          success: false,
          data: null,
          code: INTERNAL_SERVER_ERROR,
        } as ApiResponse<null>);
      }
    }),

  // Invalidate expert search cache
  invalidateExpertSearchCache: privateProcedure
    .input(
      z.object({
        expertId: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      try {
        const { expertId } = input;
        logger.info({ expertId }, "Expert ID");
        if (!expertId) {
          return c.json({
            message: "Expert ID is required",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }

        const cacheKey = "expert-search:*";

        // Clear in-memory cache first
        memoryCache.clearPattern(cacheKey);
        logger.info("In-memory cache cleared for expert searches");

        // Clear Redis cache
        const keys = await redis.keys(cacheKey);

        // Delete all found keys
        if (keys.length > 0) {
          logger.info(
            { keyCount: keys.length },
            "Found cached keys to invalidate"
          );
          const pipeline = redis.pipeline();
          keys.forEach((key) => {
            pipeline.del(key);
          });
          await pipeline.exec();
        } else {
          logger.info("No cached keys found to invalidate");
        }

        return c.json({
          message: "Cache invalidated successfully",
          success: true,
          data: null,
          code: OK,
        });
      } catch (error) {
        logger.error({ error }, "Error invalidating expert search cache");
        return c.json({
          message: "Failed to invalidate cache",
          success: false,
          data: null,
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }),
});

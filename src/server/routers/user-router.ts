import { db } from "@/db";
import { z } from "zod";

import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "@/lib/http-status-codes";
import { logger } from "@/lib/logger";

import { j, privateProcedure } from "../jstack";

export const userRouter = j.router({
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
          }),
        ]);

        return c.json({
          message: "Experts fetched successfully",
          success: true,
          data: {
            totalExperts: total,
            experts,
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
  getExpertById: privateProcedure
    .input(
      z.object({
        expertId: z.string(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      try {
        const { expertId } = input;
        if (!expertId) {
          return c.json({
            message: "Expert ID is required",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }
        const expert = await db.user.findUnique({
          where: {
            id: expertId,
          },
        });
        if (!expert) {
          return c.json({
            message: "Expert not found",
            success: false,
            data: null,
            code: NOT_FOUND,
          });
        }
        return c.json({
          message: "Expert fetched successfully",
          success: true,
          data: expert,
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
});

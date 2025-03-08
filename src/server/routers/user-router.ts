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
      //   try {
      //     const userId = ctx.user.id;
      //     const { filter: { type = "7days" } = {} } = input || {};
      //     if (!userId) {
      //       return c.json({
      //         message: "User not found",
      //         success: false,
      //         data: null,
      //         code: NOT_FOUND,
      //       });
      //     }

      //     const dateRanges = {
      //       "7days": 7,
      //       "30days": 30,
      //       "90days": 90,
      //       thisyear: 365,
      //     };

      //     const days = dateRanges[type ?? "7days"] || 7;
      //     const startDate = new Date();
      //     startDate.setDate(startDate.getDate() - days);

      //     logger.info({ startDate }, "START DATE");

      //     const prevStartDate = new Date(startDate);
      //     prevStartDate.setDate(prevStartDate.getDate() - days);

      //     logger.info({ prevStartDate }, "PREV START DATE");

      //     // **** SECTION 1: CALL ANALYTICS ****
      //     // Total calls
      //     const totalCalls = await db.call.count({
      //       where: {
      //         userId,
      //         startedAt: { gte: startDate },
      //       },
      //     });

      //     logger.info({ totalCalls }, "TOTAL CALLS");

      //     const previousTotalCalls = await db.call.count({
      //       where: {
      //         userId,
      //         startedAt: { gte: prevStartDate },
      //       },
      //     });

      //     logger.info({ previousTotalCalls }, "PREVIOUS TOTAL CALLS");

      //     const callPercentageChange =
      //       previousTotalCalls === 0
      //         ? 0
      //         : ((totalCalls - previousTotalCalls) / previousTotalCalls) * 100;

      //     logger.info({ callPercentageChange }, "CALL PERCENTAGE CHANGE");

      //     // Active experts (who had calls)
      //     const activeExperts = await db.call.groupBy({
      //       by: ["expertId"],
      //       where: {
      //         userId,
      //         startedAt: { gte: startDate },
      //       },
      //       _count: {
      //         expertId: true,
      //       },
      //     });

      //     logger.info({ activeExperts }, "ACTIVE EXPERTS");

      //     const totalActiveExperts = activeExperts.length;

      //     logger.info({ totalActiveExperts }, "TOTAL ACTIVE EXPERTS");

      //   const previousActiveExperts = await db.call.groupBy({
      //     by: ["expertId"],
      //     where: {
      //       userId,
      //       startedAt: { gte: prevStartDate, lt: startDate },
      //     },
      //     _count: {
      //       expertId: true,
      //     },
      //   });

      //     logger.info({ previousActiveExperts }, "PREVIOUS ACTIVE EXPERTS");

      //     const prevTotalActiveExperts = previousActiveExperts.length;

      //     logger.info(
      //       { prevTotalActiveExperts },
      //       "PREVIOUS TOTAL ACTIVE EXPERTS"
      //     );

      //     const expertPercentageChange =
      //       prevTotalActiveExperts === 0
      //         ? 0
      //         : ((totalActiveExperts - prevTotalActiveExperts) /
      //             prevTotalActiveExperts) *
      //           100;

      //     logger.info({ expertPercentageChange }, "EXPERT PERCENTAGE CHANGE");

      //     // Average call duration
      //     const avgCallDuration = await db.call.aggregate({
      //       _avg: { duration: true },
      //       where: {
      //         userId,
      //         startedAt: { gte: startDate },
      //       },
      //     });

      //     logger.info({ avgCallDuration }, "AVG CALL DURATION");

      //     const previousAvgCallDuration = await db.call.aggregate({
      //       _avg: { duration: true },
      //       where: {
      //         userId,
      //         startedAt: { gte: prevStartDate, lt: startDate },
      //       },
      //     });

      //     logger.info({ previousAvgCallDuration }, "PREVIOUS AVG CALL DURATION");

      //     const avgCallDurationValue = avgCallDuration._avg.duration || 0;

      //     logger.info({ avgCallDurationValue }, "AVG CALL DURATION VALUE");

      //     const previousAvgCallDurationValue =
      //       previousAvgCallDuration._avg.duration || 0;

      //     logger.info(
      //       { previousAvgCallDurationValue },
      //       "PREVIOUS AVG CALL DURATION VALUE"
      //     );

      //     const callDurationPercentageChange =
      //       previousAvgCallDurationValue === 0
      //         ? 0
      //         : ((avgCallDurationValue - previousAvgCallDurationValue) /
      //             previousAvgCallDurationValue) *
      //           100;

      //     logger.info(
      //       { callDurationPercentageChange },
      //       "CALL DURATION PERCENTAGE CHANGE"
      //     );

      //     // SECTION 2: COMMUNICATION ACTIVITY (Calls per day)
      //     const communicationActivity = await db.call.groupBy({
      //       by: ["startedAt"],
      //       where: {
      //         userId,
      //         startedAt: { gte: startDate },
      //       },
      //       _count: {
      //         id: true,
      //       },
      //     });

      //     logger.info({ communicationActivity }, "COMMUNICATION ACTIVITY");

      //     const activityByDay = communicationActivity.map((data) => ({
      //       day: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      //         data.startedAt
      //       ),
      //       callCount: data._count.id,
      //     }));

      //     logger.info({ activityByDay }, "ACTIVITY BY DAY");

      //     // SECTION 3: UPCOMING CALLS
      //     const upcomingCalls = await db.scheduledCall.findMany({
      //       where: {
      //         userId,
      //         status: "CONFIRMED",
      //         scheduledAt: { gte: new Date() },
      //       },
      //       select: {
      //         id: true,
      //         scheduledAt: true,
      //         expert: {
      //           select: {
      //             firstName: true,
      //             lastName: true,
      //             expertise: true,
      //             profilePic: true,
      //           },
      //         },
      //       },
      //       orderBy: { scheduledAt: "asc" },
      //     });

      //     logger.info({ upcomingCalls }, "UPCOMING CALLS");

      //     const totalUpcomingCalls = upcomingCalls.length;

      //     logger.info({ totalUpcomingCalls }, "TOTAL UPCOMING CALLS");

      //     const previousUpcomingCalls = await db.scheduledCall.count({
      //       where: {
      //         userId,
      //         status: "CONFIRMED",
      //         scheduledAt: { gte: prevStartDate, lt: startDate },
      //       },
      //     });

      //     logger.info({ previousUpcomingCalls }, "PREVIOUS UPCOMING CALLS");

      //     const upcomingCallsPercentageChange =
      //       previousUpcomingCalls === 0
      //         ? 0
      //         : ((totalUpcomingCalls - previousUpcomingCalls) /
      //             previousUpcomingCalls) *
      //           100;

      //     logger.info(
      //       { upcomingCallsPercentageChange },
      //       "UPCOMING CALLS PERCENTAGE CHANGE"
      //     );

      //     // SECTION 4: RECENT CALL HISTORY
      //     const recentCalls = await db.call.findMany({
      //       where: {
      //         userId,
      //       },
      //       select: {
      //         id: true,
      //         startedAt: true,
      //         duration: true,
      //         status: true,
      //         expert: {
      //           select: {
      //             firstName: true,
      //             lastName: true,
      //           },
      //         },
      //       },
      //       orderBy: { startedAt: "desc" },
      //       take: 5,
      //     });

      //     logger.info({ recentCalls }, "RECENT CALLS");

      //     return c.superjson({
      //       message: "User analytics fetched successfully",
      //       success: true,
      //       code: OK,
      //       data: {
      //         analytics: {
      //           totalCalls: {
      //             totalCalls,
      //             callPercentageChange,
      //           },
      //           activeExperts: {
      //             totalActiveExperts,
      //             expertPercentageChange,
      //           },
      //           averageCallDuration: {
      //             avgCallDurationValue,
      //             callDurationPercentageChange,
      //           },
      //           upcomingCalls: {
      //             totalUpcomingCalls,
      //             upcomingCallsPercentageChange,
      //           },
      //         },
      //         activityByDay,
      //         upcomingCalls,
      //         recentCalls,
      //       },
      //     });
      //   } catch (error) {
      //     logger.error("Error fetching user analytics", error);
      //     return c.json({
      //       message: "Internal server error",
      //       success: false,
      //       data: null,
      //       code: INTERNAL_SERVER_ERROR,
      //     });
      //   }
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
        ] = await Promise.all([
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
        const totalActiveExperts = activeExperts.length;
        const prevTotalActiveExperts = previousActiveExperts.length;
        const totalUpcomingCalls = upcomingCalls.length;
        const avgCallDurationValue = avgCallDuration._avg.duration || 0;
        const previousAvgCallDurationValue =
          previousAvgCallDuration._avg.duration || 0;

        // Calculate percentage changes
        const callPercentageChange =
          previousTotalCalls === 0
            ? 0
            : ((totalCalls - previousTotalCalls) / previousTotalCalls) * 100;

        const expertPercentageChange =
          prevTotalActiveExperts === 0
            ? 0
            : ((totalActiveExperts - prevTotalActiveExperts) /
                prevTotalActiveExperts) *
              100;

        const callDurationPercentageChange =
          previousAvgCallDurationValue === 0
            ? 0
            : ((avgCallDurationValue - previousAvgCallDurationValue) /
                previousAvgCallDurationValue) *
              100;

        const upcomingCallsPercentageChange =
          previousUpcomingCalls === 0
            ? 0
            : ((totalUpcomingCalls - previousUpcomingCalls) /
                previousUpcomingCalls) *
              100;

        // Format activity by day
        const activityByDay: Record<
          string,
          { audio_calls: number; video_calls: number; text_messages: number }
        > = {};

        // 🟢 Process communication (audio/video calls)
        communicationActivity.forEach((data) => {
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

        // 🟢 Process messages
        messagesActivity.forEach((data) => {
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
                totalCalls,
                callPercentageChange,
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
            upcomingCalls,
            recentCalls,
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
});

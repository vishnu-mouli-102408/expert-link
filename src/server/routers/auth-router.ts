import { db } from "@/db";
import { z } from "zod";

import { j, privateProcedure } from "../jstack";

const UserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  username: z.string().optional(),
  bio: z.string().nullable().optional(),
  profilePic: z.string().nullable().optional(),
  expertise: z.string().nullable().optional(),
  certifications: z.string().nullable().optional(),
  yearsOfExperience: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  hourlyRate: z.string().nullable().optional(),
  interests: z.string().nullable().optional(),
  preferences: z.string().nullable().optional(),
});

export const authRouter = j.router({
  getUserDetails: privateProcedure.query(async ({ c, ctx }) => {
    const user = await db.user.findFirst({
      where: {
        email: ctx.user.email,
      },
    });
    if (!user) {
      return c.json({ message: "User not found", success: false, data: null });
    }
    return c.json({ message: "User found", success: true, data: user });
  }),
  updateUserDetails: privateProcedure
    .input(UserSchema)
    .mutation(async ({ c, ctx, input }) => {
      try {
        console.log("INPUT", input);
        const updatedUser = await db.user.update({
          where: {
            email: ctx.user.email,
          },
          data: input,
        });
        if (!updatedUser) {
          return c.json({
            message: "User not found",
            success: false,
            data: null,
          });
        }
        return c.json({
          message: "User Updated",
          success: true,
          data: updatedUser,
        });
      } catch (error) {
        console.info("ERROR", error);
        return c.json({
          message: "Internal Server Error",
          success: false,
          error: error,
        });
      }
    }),
});

import { db } from "@/db";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { j, publicProcedure } from "../jstack";

export const authRouter = j.router({
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string(),
        externalId: z.string(),
        phone: z.string().optional(),
        role: z.enum(["USER", "EXPERT"]),
      })
    )
    .post(async ({ c, ctx, input }) => {
      const { email, externalId, fullName, phone, role } = input;

      try {
        const [createdUser, updateUserRole] = await Promise.all([
          db.user.create({
            data: {
              email,
              fullName,
              externalId,
              phone: phone || null,
              role,
            },
          }),
          clerkClient().then((userClient) =>
            userClient.users.updateUserMetadata(externalId, {
              publicMetadata: { role: role, onboardingComplete: true },
            })
          ),
        ]);

        console.info("createdUser", createdUser);
        console.info("updateUserRole", updateUserRole);

        if (createdUser && updateUserRole) {
          return c.json({ message: "User created", success: true });
        } else {
          return c.json({ message: "Internal Server Error", success: false });
        }
      } catch (error) {
        return c.json({
          message: "Internal Server Error",
          success: false,
          error: "User not created. Please try again later.",
        });
      }
    }),
});

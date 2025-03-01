import { db } from "@/db";
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
      const createdUser = await db.user.create({
        data: {
          email,
          fullName,
          externalId,
          phone: phone || null,
          role,
        },
      });

      if (createdUser) {
        return c.json({ message: "User created", success: true });
      } else {
        return c.json({ message: "User not created", success: false });
      }
    }),
});

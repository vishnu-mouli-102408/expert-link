import { db } from "@/db";

import { j, privateProcedure } from "../jstack";

export const authRouter = j.router({
  //   createUser: publicProcedure
  //     .input(
  //       z.object({
  //         email: z.string().email(),
  //         fullName: z.string(),
  //         externalId: z.string(),
  //         phone: z.string().optional(),
  //         role: z.enum(["USER", "EXPERT"]),
  //       })
  //     )
  //     .post(async ({ c, ctx, input }) => {
  //       const { email, externalId, fullName, phone, role } = input;
  //       try {
  //         const [createdUser, updateUserRole] = await Promise.all([
  //           db.user.create({
  //             data: {
  //               email,
  //               externalId,
  //             },
  //           }),
  //           clerkClient().then((userClient) =>
  //             userClient.users.updateUserMetadata(externalId, {
  //               publicMetadata: { role: role, onboardingComplete: true },
  //             })
  //           ),
  //         ]);

  //         console.info("createdUser", createdUser);
  //         console.info("updateUserRole", updateUserRole);

  //         if (createdUser && updateUserRole) {
  //           return c.json({ message: "User created", success: true });
  //         } else {
  //           return c.json({ message: "Internal Server Error", success: false });
  //         }
  //       } catch (error) {
  //         return c.json({
  //           message: "Internal Server Error",
  //           success: false,
  //           error: "User not created. Please try again later.",
  //         });
  //       }
  //     }),
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
});

"use server";

import { clerkClient } from "@clerk/nextjs/server";

import type { Roles } from "@/types/global";

export async function setRole(id: string, role: Roles) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(id, {
      publicMetadata: { role, onboardingComplete: true },
    });

    // if (res?.publicMetadata) {
    //   const createdUser = await db.user.create({
    //     data: {
    //       email: res?.emailAddresses?.[0]?.emailAddress || "",
    //       fullName: res?.fullName || "",
    //       externalId: res?.id,
    //       phone: res?.phoneNumbers?.[0]?.phoneNumber || null,
    //       role: (role?.toUpperCase() as "USER" | "EXPERT") || "USER",
    //     },
    //   });
    //   console.info("CREATED USER", createdUser);

    //   if (createdUser) {
    //     return { message: "User created", success: true };
    //   }
    // } else {
    //   return { message: "Internal Server Error", success: false };
    // }

    return { message: res.publicMetadata, success: true };
  } catch (err) {
    console.info("ERROR", err);
    return { message: "Internal Server Error", success: false, error: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

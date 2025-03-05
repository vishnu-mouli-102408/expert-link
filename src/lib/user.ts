"use server";

import { db } from "@/db";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";

import type { Roles } from "@/types/global";

export async function setRole(id: string, role: Roles) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(id, {
      publicMetadata: { role, onboardingComplete: true },
    });

    return { message: res.publicMetadata, success: true };
  } catch (err) {
    console.info("ERROR", err);
    return { message: "Internal Server Error", success: false, error: err };
  }
}

export async function createUser(
  userPayload: Omit<
    User,
    "id" | "createdAt" | "updatedAt" | "role" | "gender" | "bio" | "expertise"
  >
) {
  try {
    const user = await db.user.create({
      data: {
        email: userPayload.email,
        externalId: userPayload.externalId,
        firstName: userPayload.firstName,
        lastName: userPayload.lastName,
        phone: userPayload.phone,
        username: userPayload.username,
      },
    });
    console.info("DB USER", user);

    return { message: "User created", success: true };
  } catch (error) {
    console.info("USER ERROR", error);

    return {
      message: "Internal Server Error",
      success: false,
      error: "User not created. Please try again later.",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await db.user.delete({
      where: {
        externalId: id,
      },
    });
    console.info("DB DELETE USER", user);
    return { message: "User deleted", success: true };
  } catch (error) {
    console.info("DELETE USER ERROR", error);
    return {
      message: "Internal Server Error",
      success: false,
      error: "User not deleted. Please try again later.",
    };
  }
}

"use server";

import { db } from "@/db";
import { clerkClient } from "@clerk/nextjs/server";

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

export async function createUser(userPayload: {
  email: string;
  externalId: string;
}) {
  try {
    await db.user.create({
      data: {
        email: userPayload.email,
        externalId: userPayload.externalId,
      },
    });
    return { message: "User created", success: true };
  } catch (error) {
    return {
      message: "Internal Server Error",
      success: false,
      error: "User not created. Please try again later.",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: {
        id,
      },
    });
    return { message: "User deleted", success: true };
  } catch (error) {
    return {
      message: "Internal Server Error",
      success: false,
      error: "User not deleted. Please try again later.",
    };
  }
}

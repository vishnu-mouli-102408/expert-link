"use server";

import { db } from "@/db";
import { clerkClient } from "@clerk/nextjs/server";
import type { Role, User } from "@prisma/client";

import type { Roles } from "@/types/global";

import {
  ACCEPTED,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
} from "./http-status-codes";

export async function setRole(id: string, role: Roles) {
  const client = await clerkClient();

  try {
    const [res, roleUpdate] = await Promise.all([
      client.users.updateUser(id, {
        publicMetadata: { role, onboardingComplete: true },
      }),
      db.user.update({
        where: { externalId: id },
        data: { role: role?.toUpperCase() as Role },
      }),
    ]);

    if (!res || !roleUpdate) {
      throw new Error("One or both role updates failed.");
    }

    console.info("✅ Clerk Role Updated:", res.publicMetadata);
    console.info("✅ DB Role Updated:", roleUpdate);

    return {
      message: res.publicMetadata,
      success: true,
      data: roleUpdate,
      code: ACCEPTED,
    };
  } catch (err) {
    console.error("❌ ERROR:", err);
    return {
      message: "Internal Server Error",
      success: false,
      error: err instanceof Error ? err.message : err,
      code: INTERNAL_SERVER_ERROR,
    };
  }
}

export async function createUser(
  userPayload: Omit<
    User,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "gender"
    | "bio"
    | "expertise"
    | "certifications"
    | "yearsOfExperience"
    | "availability"
    | "hourlyRate"
    | "interests"
    | "preferences"
    | "skills"
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
        profilePic: userPayload.profilePic,
      },
    });
    console.info("DB USER", user);

    return { message: "User created", success: true, code: CREATED };
  } catch (error) {
    console.info("USER ERROR", error);

    return {
      message: "Internal Server Error",
      success: false,
      error: "User not created. Please try again later.",
      code: INTERNAL_SERVER_ERROR,
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
    return { message: "User deleted", success: true, code: OK };
  } catch (error) {
    console.info("DELETE USER ERROR", error);
    return {
      message: "Internal Server Error",
      success: false,
      error: "User not deleted. Please try again later.",
      code: INTERNAL_SERVER_ERROR,
    };
  }
}

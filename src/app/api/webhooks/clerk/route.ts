import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import env from "@/env";
import { WebhookEvent } from "@clerk/nextjs/server";
import type { Role } from "@prisma/client";
import { Webhook } from "svix";

import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "@/lib/http-status-codes";
import { createUser, deleteUser } from "@/lib/user";

export async function GET() {
  try {
    const user = await db.user.create({
      data: {
        email: "example@gmail.com",
        externalId: "12345",
      },
    });
    console.info("USER", user);
    return NextResponse.json({
      message: "Webhook route",
      data: user,
      code: OK,
    });
  } catch (error) {
    console.info("ERROR", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error,
      code: INTERNAL_SERVER_ERROR,
    });
  }
}

export async function POST(req: Request) {
  console.info("INSIDE POST WEBHOOK");

  const SIGNING_SECRET = env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  console.info("SIGNING_SECRET", SIGNING_SECRET);

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.info("HEADER PAYLOAD");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body

  console.info("BEFORE BODY");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.info("AFTER BODY");

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  console.info("EVENT TYPE", eventType);
  console.info("EVENT DATA", evt.data);

  if (eventType === "user.created") {
    console.info("INSIDE USER CREATED");

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      phone_numbers,
      username,
      image_url,
      public_metadata,
    } = evt.data;

    const user = await createUser({
      email: email_addresses?.[0]?.email_address || "",
      externalId: id,
      firstName: first_name,
      lastName: last_name,
      phone: phone_numbers?.[0]?.phone_number || null,
      username: username,
      profilePic: image_url,
      role: (public_metadata?.role as Role) || null,
    });

    console.info("USER", user);

    if (user?.success) {
      console.info("User created successfully");
      return NextResponse.json({
        message: "User created",
        success: true,
        code: CREATED,
      });
    }
  }

  if (eventType === "user.deleted") {
    console.info("INSIDE USER DELETED");
    const { id } = evt.data;
    if (!id)
      return new Response("Error: Missing user ID", { status: NOT_FOUND });
    const user = await deleteUser(id);
    console.info("DELETE USER", user);

    if (user?.success) {
      console.info("User deleted successfully");
      return NextResponse.json({
        message: "User deleted",
        success: true,
        code: OK,
      });
    }
  }

  console.info(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.info("Webhook payload:", body);

  return new Response("Webhook received", { status: 200 });
}

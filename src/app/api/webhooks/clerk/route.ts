import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { createUser, deleteUser } from "@/lib/user";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

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

  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data;

    const user = await createUser({
      email: email_addresses?.[0]?.email_address || "",
      externalId: id,
    });

    if (user?.success) {
      console.info("User created successfully");
      return NextResponse.json({ message: "User created", success: true });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (!id) return new Response("Error: Missing user ID", { status: 400 });
    const user = await deleteUser(id);
    if (user?.success) {
      console.info("User deleted successfully");
      return NextResponse.json({ message: "User deleted", success: true });
    }
  }

  console.info(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.info("Webhook payload:", body);

  return new Response("Webhook received", { status: 200 });
}

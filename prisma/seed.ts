import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Users (Experts & Regular Users)
  const user1 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      firstName: "Chris",
      lastName: "Don",
      role: "USER",
      gender: "Male",
      bio: "Just a regular user.",
      phone: "+1234567890",
      username: "john_doe",
    },
  });

  const expert1 = await prisma.user.create({
    data: {
      email: "expert2@example.com",
      firstName: "Mark",
      lastName: "Wood",
      role: "EXPERT",
      gender: "Female",
      bio: "Marketing expert with 10+ years of experience.",
      expertise: "Marketing",
      phone: "+9876543210",
      username: "jane_smith",
      certifications: "MBA in Digital Marketing",
      yearsOfExperience: "10",
      availability: "Monday-Friday, 10 AM - 5 PM",
      hourlyRate: "50",
    },
  });

  // Create Mock Calls
  await prisma.call.createMany({
    data: [
      {
        userId: user1.id,
        expertId: expert1.id,
        callType: "VIDEO",
        duration: 30, // in minutes
        startedAt: new Date(),
        status: "COMPLETED",
      },
      {
        userId: user1.id,
        expertId: expert1.id,
        callType: "AUDIO",
        duration: 20,
        startedAt: new Date(),
        status: "COMPLETED",
      },
    ],
  });

  // Create Mock Messages
  await prisma.message.createMany({
    data: [
      {
        senderId: user1.id,
        receiverId: expert1.id,
        content: "Hello, I need help with marketing!",
        sentAt: new Date(),
        messageType: "TEXT",
      },
      {
        senderId: expert1.id,
        receiverId: user1.id,
        content: "Sure! What do you need help with?",
        sentAt: new Date(),
        messageType: "TEXT",
      },
    ],
  });

  // Create Scheduled Calls
  await prisma.scheduledCall.createMany({
    data: [
      {
        userId: user1.id,
        expertId: expert1.id,
        scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        callType: "VIDEO",
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

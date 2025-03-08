-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('ONGOING', 'COMPLETED', 'MISSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "ScheduledCallStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "callType" "CallType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "CallStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledCall" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "callType" "CallType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "status" "ScheduledCallStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualCallId" TEXT,

    CONSTRAINT "ScheduledCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Call_userId_idx" ON "Call"("userId");

-- CreateIndex
CREATE INDEX "Call_expertId_idx" ON "Call"("expertId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "ScheduledCall_userId_idx" ON "ScheduledCall"("userId");

-- CreateIndex
CREATE INDEX "ScheduledCall_expertId_idx" ON "ScheduledCall"("expertId");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledCall" ADD CONSTRAINT "ScheduledCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledCall" ADD CONSTRAINT "ScheduledCall_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledCall" ADD CONSTRAINT "ScheduledCall_actualCallId_fkey" FOREIGN KEY ("actualCallId") REFERENCES "Call"("id") ON DELETE SET NULL ON UPDATE CASCADE;

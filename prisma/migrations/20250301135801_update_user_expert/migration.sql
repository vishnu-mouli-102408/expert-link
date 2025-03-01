/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Expert` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Expert" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Expert_externalId_key" ON "Expert"("externalId");

-- CreateIndex
CREATE INDEX "Expert_email_idx" ON "Expert"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

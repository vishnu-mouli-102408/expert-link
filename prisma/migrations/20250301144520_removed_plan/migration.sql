/*
  Warnings:

  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `quotaLimit` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "plan",
DROP COLUMN "quotaLimit";

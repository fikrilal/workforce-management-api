/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "displayName",
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;

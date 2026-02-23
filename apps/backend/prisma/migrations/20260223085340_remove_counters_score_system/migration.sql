/*
  Warnings:

  - You are about to drop the column `followersCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `likesReceivedCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "followersCount",
DROP COLUMN "followingsCount",
DROP COLUMN "likesReceivedCount",
DROP COLUMN "score";

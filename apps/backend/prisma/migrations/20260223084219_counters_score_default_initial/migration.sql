/*
  Warnings:

  - Made the column `followersCount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followingsCount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likesReceivedCount` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "followersCount" SET NOT NULL,
ALTER COLUMN "followersCount" SET DEFAULT 0,
ALTER COLUMN "followingsCount" SET NOT NULL,
ALTER COLUMN "followingsCount" SET DEFAULT 0,
ALTER COLUMN "likesReceivedCount" SET NOT NULL,
ALTER COLUMN "likesReceivedCount" SET DEFAULT 0,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0;

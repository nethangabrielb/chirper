/*
  Warnings:

  - Added the required column `unread` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "unread" BOOLEAN NOT NULL;

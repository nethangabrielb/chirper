-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "followersCount" INTEGER,
ADD COLUMN     "followingsCount" INTEGER,
ADD COLUMN     "likesReceivedCount" INTEGER,
ADD COLUMN     "score" INTEGER;

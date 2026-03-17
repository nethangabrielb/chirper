-- DropIndex
DROP INDEX "public"."Bookmark_id_idx";

-- DropIndex
DROP INDEX "public"."Post_id_userId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Room_id_idx";

-- DropIndex
DROP INDEX "public"."User_id_name_username_email_idx";

-- CreateIndex
CREATE INDEX "Post_userId_createdAt_idx" ON "public"."Post"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_name_username_email_idx" ON "public"."User"("name", "username", "email");

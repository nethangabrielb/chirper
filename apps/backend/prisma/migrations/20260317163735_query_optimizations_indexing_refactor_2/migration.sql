-- DropIndex
DROP INDEX "public"."User_name_username_email_idx";

-- CreateIndex
CREATE INDEX "User_name_idx" ON "public"."User"("name");

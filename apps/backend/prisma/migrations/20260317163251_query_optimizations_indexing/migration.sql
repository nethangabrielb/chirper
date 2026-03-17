-- CreateIndex
CREATE INDEX "Bookmark_id_idx" ON "public"."Bookmark"("id");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "public"."Follow"("followingId");

-- CreateIndex
CREATE INDEX "Message_roomId_createdAt_idx" ON "public"."Message"("roomId", "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Notification_receiverId_createdAt_idx" ON "public"."Notification"("receiverId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_id_userId_createdAt_idx" ON "public"."Post"("id", "userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Room_id_idx" ON "public"."Room"("id");

-- CreateIndex
CREATE INDEX "User_id_name_username_email_idx" ON "public"."User"("id", "name", "username", "email");

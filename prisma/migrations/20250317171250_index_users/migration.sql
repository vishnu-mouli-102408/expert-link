-- CreateIndex
CREATE INDEX "idx_user_role" ON "User"("role");

-- CreateIndex
CREATE INDEX "idx_user_expertise" ON "User"("expertise");

-- CreateIndex
CREATE INDEX "idx_user_hourly_rate" ON "User"("hourlyRate");

-- CreateIndex
CREATE INDEX "idx_user_skills" ON "User"("skills");

-- CreateIndex
CREATE INDEX "idx_user_first_name" ON "User"("firstName");

-- CreateIndex
CREATE INDEX "idx_user_last_name" ON "User"("lastName");

-- CreateIndex
CREATE INDEX "idx_user_username" ON "User"("username");

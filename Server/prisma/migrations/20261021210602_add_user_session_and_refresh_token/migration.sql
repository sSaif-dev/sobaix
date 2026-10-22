-- CreateTable
CREATE TABLE "UserSession" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "DeviceLabel" TEXT,
    "UserAgent" TEXT,
    "IpAddress" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "RevokedAt" TIMESTAMP(3),

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "Id" SERIAL NOT NULL,
    "SessionId" INTEGER NOT NULL,
    "TokenHash" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "UsedAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "UserSession_UserId_idx" ON "UserSession"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_TokenHash_key" ON "RefreshToken"("TokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_SessionId_idx" ON "RefreshToken"("SessionId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_SessionId_fkey" FOREIGN KEY ("SessionId") REFERENCES "UserSession"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "Password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ExternalIdentity" (
    "Id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Provider" TEXT NOT NULL,
    "Issuer" TEXT NOT NULL,
    "Subject" TEXT NOT NULL,

    CONSTRAINT "ExternalIdentity_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "ExternalIdentity_UserId_idx" ON "ExternalIdentity"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentity_Issuer_Subject_key" ON "ExternalIdentity"("Issuer", "Subject");

-- AddForeignKey
ALTER TABLE "ExternalIdentity" ADD CONSTRAINT "ExternalIdentity_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

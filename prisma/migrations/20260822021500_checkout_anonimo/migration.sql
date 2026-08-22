-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Application" ADD COLUMN "email" TEXT;
ALTER TABLE "Application" ADD COLUMN "whatsapp" TEXT;
ALTER TABLE "Application" ADD COLUMN "accessTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_accessTokenHash_key" ON "Application"("accessTokenHash");

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "mpPreferenceId" TEXT NOT NULL,
    "mpPaymentId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mpPaymentId_key" ON "Payment"("mpPaymentId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

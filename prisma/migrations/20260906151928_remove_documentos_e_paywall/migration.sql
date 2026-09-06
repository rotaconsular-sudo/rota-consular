/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_applicationId_fkey";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "PaymentStatus";

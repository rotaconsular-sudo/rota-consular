-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "estatistica" BOOLEAN NOT NULL,
    "marketing" BOOLEAN NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentLog_visitorId_idx" ON "ConsentLog"("visitorId");

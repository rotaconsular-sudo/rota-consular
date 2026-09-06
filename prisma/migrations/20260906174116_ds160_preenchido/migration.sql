-- CreateEnum
CREATE TYPE "Ds160Status" AS ENUM ('RASCUNHO', 'ENVIADO', 'ENTREGUE');

-- CreateTable
CREATE TABLE "SolicitacaoDs160" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cpf" TEXT,
    "dados" JSONB NOT NULL DEFAULT '{}',
    "status" "Ds160Status" NOT NULL DEFAULT 'RASCUNHO',
    "numeroDs160" TEXT,
    "enviadoEm" TIMESTAMP(3),
    "entregueEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitacaoDs160_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SolicitacaoDs160_userId_idx" ON "SolicitacaoDs160"("userId");

-- AddForeignKey
ALTER TABLE "SolicitacaoDs160" ADD CONSTRAINT "SolicitacaoDs160_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ProdutoTipo" AS ENUM ('PRINCIPAL', 'ORDER_BUMP');

-- CreateEnum
CREATE TYPE "ConteudoTipo" AS ENUM ('VIDEO', 'PDF', 'ROTEIRO', 'LINK');

-- CreateEnum
CREATE TYPE "CompraStatus" AS ENUM ('PENDENTE', 'APROVADA', 'ESTORNADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "AcessoOrigem" AS ENUM ('COMPRA', 'MANUAL', 'CORTESIA');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "precoCents" INTEGER NOT NULL,
    "tipo" "ProdutoTipo" NOT NULL DEFAULT 'PRINCIPAL',
    "duracaoDias" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conteudo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "ConteudoTipo" NOT NULL,
    "videoUrl" TEXT,
    "blobUrl" TEXT,
    "arquivoNome" TEXT,
    "markdown" TEXT,
    "link" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoConteudo" (
    "produtoId" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "ProdutoConteudo_pkey" PRIMARY KEY ("produtoId","conteudoId")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "status" "CompraStatus" NOT NULL DEFAULT 'PENDENTE',
    "valorCents" INTEGER NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraItem" (
    "id" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "precoCents" INTEGER NOT NULL,

    CONSTRAINT "CompraItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acesso" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "origem" "AcessoOrigem" NOT NULL DEFAULT 'COMPRA',
    "compraId" TEXT,
    "expiraEm" TIMESTAMP(3),
    "revogadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acesso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_slug_key" ON "Produto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_mpPaymentId_key" ON "Compra"("mpPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Acesso_userId_produtoId_key" ON "Acesso"("userId", "produtoId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoConteudo" ADD CONSTRAINT "ProdutoConteudo_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoConteudo" ADD CONSTRAINT "ProdutoConteudo_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "Conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

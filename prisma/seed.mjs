// Catálogo inicial da loja — os 4 produtos que já existiam em
// src/lib/products.ts (1 principal + 3 order bumps).
//
// Idempotente: `ON CONFLICT (slug) DO NOTHING` — rodar de novo não
// sobrescreve nada que você já tenha ajustado no /admin.
//
// Uso (depois de `prisma migrate deploy`):  node prisma/seed.mjs

import "dotenv/config";
import { randomUUID } from "node:crypto";
import pg from "pg";

const PRODUTOS = [
  {
    slug: "mapa-ds160",
    nome: "DS-160 Sem Erros",
    descricao:
      "Preencha seu DS-160 pelo nosso formulário 100% em português. Nossa equipe revisa suas respostas e faz o envio oficial ao Consulado americano por você.",
    precoCents: 2790,
    tipo: "PRINCIPAL",
    duracaoDias: 365,
    ordem: 0,
  },
  {
    slug: "checklist-casv",
    nome: "Checklist CASV + Entrevista Consular",
    descricao:
      "Lista rápida para conferir documentos, informações e pontos importantes antes de sair de casa para o CASV e para a entrevista consular.",
    precoCents: 990,
    tipo: "ORDER_BUMP",
    duracaoDias: 365,
    ordem: 1,
  },
  {
    slug: "checklist-entrevista",
    nome: "Checklist Preparatório para a Entrevista do Visto Americano",
    descricao:
      "Revise as principais informações do seu processo e veja perguntas que podem surgir na entrevista para chegar mais preparado(a) e seguro(a).",
    precoCents: 990,
    tipo: "ORDER_BUMP",
    duracaoDias: 365,
    ordem: 2,
  },
  {
    slug: "acesso-atualizacoes",
    nome: "Acesso a Atualizações",
    descricao:
      "Receba acesso às atualizações do material quando houver novas versões, ajustes ou mudanças, sem precisar comprar novamente.",
    precoCents: 990,
    tipo: "ORDER_BUMP",
    duracaoDias: 365,
    ordem: 3,
  },
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

let inseridos = 0;
for (const p of PRODUTOS) {
  const res = await pool.query(
    `INSERT INTO "Produto"
       ("id", "slug", "nome", "descricao", "precoCents", "tipo", "duracaoDias", "ativo", "ordem", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6::"ProdutoTipo", $7, true, $8, now(), now())
     ON CONFLICT ("slug") DO NOTHING`,
    [randomUUID(), p.slug, p.nome, p.descricao, p.precoCents, p.tipo, p.duracaoDias, p.ordem],
  );
  if (res.rowCount > 0) {
    inseridos += 1;
    console.log(`  + ${p.slug}`);
  } else {
    console.log(`  = ${p.slug} (já existe, mantido)`);
  }
}

console.log(`\nCatálogo: ${inseridos} inserido(s), ${PRODUTOS.length - inseridos} mantido(s).`);
await pool.end();

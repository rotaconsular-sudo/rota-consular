import { randomBytes, createHash } from "node:crypto";

// Token opaco (não é JWT) — o valor cru só existe no link enviado por
// e-mail e no cookie do navegador. O banco guarda só o hash, então um
// vazamento do banco não expõe sessões ou links válidos.
export function generateToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

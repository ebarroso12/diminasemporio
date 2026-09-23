/**
 * Aplica um .sql de scripts/ no Postgres do Supabase.
 * Usa POSTGRES_URL_NON_POOLING (conexão direta) porque DDL não combina
 * com pooler em modo transação.
 * Uso: node --env-file=.env.local scripts/aplicar-schema.mjs [arquivo.sql]
 */
import { readFileSync } from "node:fs";
import pg from "pg";

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!url) throw new Error("Falta POSTGRES_URL_NON_POOLING no ambiente.");

const arquivo = process.argv[2] ?? "schema.sql";
const sql = readFileSync(new URL(`./${arquivo}`, import.meta.url), "utf8");

// O sslmode da própria URL sobrepõe a opção `ssl` do pg e derruba a conexão
// com SELF_SIGNED_CERT_IN_CHAIN. Tira-se o parâmetro e o TLS vai explícito.
const semSslMode = new URL(url);
semSslMode.searchParams.delete("sslmode");

const cliente = new pg.Client({
  connectionString: semSslMode.toString(),
  ssl: { rejectUnauthorized: false },
});

await cliente.connect();
try {
  await cliente.query(sql);
  console.log(`${arquivo} aplicado`);
} finally {
  await cliente.end();
}

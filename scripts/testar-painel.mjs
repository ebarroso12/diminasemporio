/**
 * Teste de ponta a ponta do painel, num navegador de verdade:
 * login → edição de produto → aba de usuários → troca de senha.
 * Uso: node scripts/testar-painel.mjs [urlBase]
 */
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3000";
const EMAIL = "diminascafeemporio@gmail.com";
const SENHA = "Mudar1234!";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PASTA = process.env.PASTA_CAPTURAS ?? ".";

const passos = [];
const registrar = (nome, ok, detalhe = "") =>
  passos.push({ nome, ok, detalhe }) && console.log(`${ok ? "OK  " : "FALHA"} ${nome} ${detalhe}`);

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1280, height: 900 });

  // 1. Tela de login
  await pagina.goto(`${BASE}/admin`, { waitUntil: "networkidle2" });
  await pagina.waitForSelector("#email", { timeout: 15000 });
  await pagina.screenshot({ path: `${PASTA}/painel-1-login.png` });
  registrar("tela de login carregou", true);

  // 2. Link de recuperação existe
  const temEsqueci = await pagina.evaluate(() =>
    [...document.querySelectorAll("button")].some((b) => b.textContent.includes("Esqueci minha senha"))
  );
  registrar("link 'Esqueci minha senha'", temEsqueci);

  // 3. Olho revela a senha
  await pagina.type("#senha", "teste");
  await pagina.click('button[aria-label="Mostrar senha"]');
  const revelou = await pagina.$eval("#senha", (el) => el.type === "text");
  registrar("olho revela a senha", revelou);
  // Recarrega em vez de limpar o campo na mão: mexer em el.value não avisa o
  // React, e o texto de teste continuaria no estado do componente.
  await pagina.reload({ waitUntil: "networkidle2" });
  await pagina.waitForSelector("#email");

  // 4. Login
  await pagina.type("#email", EMAIL);
  await pagina.type("#senha", SENHA);
  await pagina.click('button[type="submit"]');
  await pagina.waitForFunction(() => document.body.innerText.includes("Painel do Di Minas"), {
    timeout: 30000,
  });
  await pagina.screenshot({ path: `${PASTA}/painel-2-cardapio.png` });
  registrar("login entrou no painel", true);

  // 5. Editar preço do primeiro produto
  const precoNovo = "27.55";
  await pagina.waitForSelector('input[placeholder="34.90"]');
  await pagina.evaluate(() => {
    const campo = document.querySelector('input[placeholder="34.90"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(campo, "");
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await pagina.type('input[placeholder="34.90"]', precoNovo);
  await pagina.evaluate(() => {
    const botao = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Salvar");
    botao?.click();
  });
  await pagina.waitForFunction(() => document.body.innerText.includes("Alteração salva"), {
    timeout: 20000,
  });
  registrar("editar preço salvou", true);

  // 6. O preço novo chega na API pública
  const conferido = await pagina.evaluate(async (esperado) => {
    const lista = await (await fetch("/api/produtos")).json();
    return lista.some((p) => Number(p.preco) === Number(esperado));
  }, precoNovo);
  registrar("preço novo visível na API pública", conferido);

  // Devolve o preço original
  await pagina.evaluate(() => {
    const campo = document.querySelector('input[placeholder="34.90"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(campo, "25.9");
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Salvar")?.click();
  });
  await new Promise((r) => setTimeout(r, 2500));

  // 7. Aba de usuários
  await pagina.evaluate(() =>
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Usuários")?.click()
  );
  await pagina.waitForFunction(() => document.body.innerText.includes("Quem administra o site"), {
    timeout: 10000,
  });
  await pagina.screenshot({ path: `${PASTA}/painel-3-usuarios.png` });
  const listaOk = await pagina.evaluate(() => document.body.innerText.includes("diminascafeemporio"));
  registrar("aba de usuários lista o admin", listaOk);

  // 8. Aba da conta (trocar senha)
  await pagina.evaluate(() =>
    [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Minha conta")?.click()
  );
  await pagina.waitForFunction(() => document.body.innerText.includes("Trocar minha senha"), {
    timeout: 10000,
  });
  await pagina.screenshot({ path: `${PASTA}/painel-4-conta.png` });
  registrar("aba de trocar senha carregou", true);

  // 9. Senha atual errada é recusada
  await pagina.type("#senha-atual", "senhaErrada123");
  await pagina.type("#senha-nova", "OutraSenha123!");
  await pagina.type("#senha-confirma", "OutraSenha123!");
  await pagina.evaluate(() =>
    [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Salvar senha nova"))?.click()
  );
  await pagina.waitForFunction(() => document.body.innerText.includes("senha atual está incorreta"), {
    timeout: 20000,
  });
  registrar("senha atual errada é recusada", true);
} catch (erro) {
  registrar("erro inesperado", false, erro.message);
} finally {
  await navegador.close();
}

const falhas = passos.filter((p) => !p.ok);
console.log(`\n${passos.length - falhas.length}/${passos.length} passos OK`);
if (falhas.length) process.exit(1);

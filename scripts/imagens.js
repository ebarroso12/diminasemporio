const sharp = require("sharp");
const path = require("path");
const F = (n) => path.join("public", "fotos", n);

// Recortes candidatos: [arquivo-fonte, {left,top,width,height}, destino]
const crops = [
  ["lancamento.jpeg", { left: 200, top: 420, width: 490, height: 262 }, "pao-de-queijo-tradicional.jpeg"],
  ["lancamento.jpeg", { left: 252, top: 668, width: 345, height: 300 }, "doce-de-leite.jpeg"],
  ["produtos-colagem.jpeg", { left: 232, top: 692, width: 156, height: 142 }, "bolos-caseiros.jpeg"],
  ["produtos-colagem.jpeg", { left: 427, top: 692, width: 156, height: 142 }, "pudim-tortas.jpeg"],
  ["produtos-colagem.jpeg", { left: 622, top: 692, width: 156, height: 142 }, "produtos-mineiros.jpeg"],
  ["produtos-colagem.jpeg", { left: 817, top: 692, width: 156, height: 142 }, "cafes-especiais.jpeg"],
];

(async () => {
  for (const [src, region, out] of crops) {
    await sharp(F(src)).extract(region).jpeg({ quality: 88 }).toFile(F(out));
    console.log("crop ->", out);
  }

  // Logo: recorte circular com fundo transparente
  const D = 1120;
  const mask = Buffer.from(
    `<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`
  );
  await sharp(F("logo-original.jpeg"))
    .extract({ left: 67, top: 67, width: D, height: D })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toFile(F("logo.png"));
  console.log("logo -> logo.png");

  // Folha de contato para conferência visual
  const tiles = ["pao-de-queijo-tradicional.jpeg", "doce-de-leite.jpeg", "bolos-caseiros.jpeg",
                 "pudim-tortas.jpeg", "produtos-mineiros.jpeg", "cafes-especiais.jpeg", "logo.png"];
  const S = 240;
  const composites = [];
  for (let i = 0; i < tiles.length; i++) {
    const buf = await sharp(F(tiles[i])).resize(S, S, { fit: "cover" }).toBuffer();
    composites.push({ input: buf, left: (i % 4) * S, top: Math.floor(i / 4) * S });
  }
  await sharp({ create: { width: S * 4, height: S * 2, channels: 3, background: "#e5e5e5" } })
    .composite(composites)
    .jpeg()
    .toFile("scripts/contato.jpg");
  console.log("folha de contato -> scripts/contato.jpg");
})();

import { NextResponse } from "next/server";
import { administradorAtual } from "@/lib/admin";
import { supabaseEscrita, BUCKET_FOTOS } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  if (!(await administradorAtual())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const db = supabaseEscrita();
  if (!db) {
    return NextResponse.json(
      { erro: "Supabase não configurado — o envio de fotos precisa do Storage." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const arquivo = form.get("arquivo");

  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    return NextResponse.json(
      { erro: "Formato não aceito. Envie JPG, PNG, WebP ou AVIF." },
      { status: 400 }
    );
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ erro: "A foto precisa ter no máximo 5 MB." }, { status: 400 });
  }

  const extensao = arquivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const caminho = `${Date.now()}-${crypto.randomUUID()}.${extensao}`;

  const { error } = await db.storage
    .from(BUCKET_FOTOS)
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: false });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  const { data } = db.storage.from(BUCKET_FOTOS).getPublicUrl(caminho);
  return NextResponse.json({ url: data.publicUrl });
}

import type { Metadata } from "next";
import { administradorAtual, listarAdministradores } from "@/lib/admin";
import { listarProdutos, usandoCatalogoLocal } from "@/lib/produtos";
import { supabaseConfigurado, escritaConfigurada } from "@/lib/supabase";
import { supabaseServidor } from "@/lib/supabase/servidor";
import FormularioLogin from "@/components/admin/FormularioLogin";
import PainelAdmin from "@/components/admin/PainelAdmin";
import SemPermissao from "@/components/admin/SemPermissao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrador",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!supabaseConfigurado) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="sombra-cartao max-w-md rounded-suave bg-creme-2 p-8 ring-1 ring-creme-3">
          <h1 className="font-display text-2xl font-semibold text-marinho">Painel indisponível</h1>
          <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
            O banco de dados não está configurado. Ligue a integração do Supabase no projeto da
            Vercel — ela injeta sozinha as variáveis
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
            e
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">
              SUPABASE_SERVICE_ROLE_KEY
            </code>
            — e publique de novo.
          </p>
        </div>
      </div>
    );
  }

  const administrador = await administradorAtual();

  if (!administrador) {
    // Há gente autenticada que não administra o site: o cadastro do Supabase
    // é aberto, e só quem está em `administradores` entra aqui.
    const sessao = await supabaseServidor();
    const {
      data: { user },
    } = await sessao.auth.getUser();

    return user ? <SemPermissao email={user.email ?? ""} /> : <FormularioLogin />;
  }

  const [produtos, administradores] = await Promise.all([
    listarProdutos(),
    listarAdministradores(),
  ]);

  return (
    <PainelAdmin
      produtosIniciais={produtos}
      administradoresIniciais={administradores}
      administradorAtual={administrador}
      somenteLeitura={usandoCatalogoLocal || !escritaConfigurada}
    />
  );
}

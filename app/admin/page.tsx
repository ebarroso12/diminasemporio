import type { Metadata } from "next";
import { sessaoValida, adminConfigurado } from "@/lib/auth";
import { listarProdutos, usandoCatalogoLocal } from "@/lib/produtos";
import { escritaConfigurada } from "@/lib/supabase";
import FormularioLogin from "@/components/admin/FormularioLogin";
import PainelAdmin from "@/components/admin/PainelAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrador",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!adminConfigurado) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="sombra-cartao max-w-md rounded-suave bg-creme-2 p-8 ring-1 ring-creme-3">
          <h1 className="font-display text-2xl font-semibold text-marinho">Painel bloqueado</h1>
          <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
            Para liberar o acesso, defina a variável de ambiente
            <code className="mx-1 rounded bg-creme-3 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>
            no projeto da Vercel e publique de novo. Sem ela não existe senha padrão — o painel
            fica fechado de propósito.
          </p>
        </div>
      </div>
    );
  }

  if (!(await sessaoValida())) {
    return <FormularioLogin />;
  }

  const produtos = await listarProdutos();

  return (
    <PainelAdmin
      produtosIniciais={produtos}
      somenteLeitura={usandoCatalogoLocal || !escritaConfigurada}
    />
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";

export default function SemPermissao({ email }: { email: string }) {
  const router = useRouter();

  async function sair() {
    await supabaseNavegador().auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="sombra-cartao max-w-sm rounded-suave bg-creme-2 p-8 text-center ring-1 ring-creme-3">
        <Image
          src="/fotos/logo.png"
          alt="Di Minas"
          width={140}
          height={140}
          className="mx-auto h-20 w-20 rounded-full"
        />
        <h1 className="mt-5 font-display text-2xl font-semibold text-marinho">Sem acesso</h1>
        <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
          A conta <strong className="text-marinho">{email}</strong> está conectada, mas não é
          administradora do site. Peça a quem já administra para liberar o seu e-mail no painel.
        </p>
        <button
          onClick={sair}
          className="mt-6 w-full rounded-full bg-marinho py-3.5 font-bold text-creme transition-transform hover:scale-[1.02]"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

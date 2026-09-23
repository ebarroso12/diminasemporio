"use client";

import { useState } from "react";

/** Campo de senha com o olho para revelar o que foi digitado. */
export default function CampoSenha({
  id,
  valor,
  aoMudar,
  autoComplete = "new-password",
  placeholder,
}: {
  id: string;
  valor: string;
  aoMudar: (valor: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative mt-1.5">
      <input
        id={id}
        type={visivel ? "text" : "password"}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="entrada py-3 pr-12"
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-tinta-suave transition-colors hover:text-marinho"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3" />
          {!visivel && <path d="M4 20 20 4" />}
        </svg>
      </button>
    </div>
  );
}

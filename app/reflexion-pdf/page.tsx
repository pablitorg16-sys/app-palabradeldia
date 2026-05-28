"use client";

import { useState } from "react";

type ReflectionPdfData = {
  gospelTitle?: string;
  gospelText?: string;
  reflectionText?: string;
  authorName?: string;
  date?: string;
};

export default function ReflectionPdfPage() {
  const [data] = useState<ReflectionPdfData | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("palabradeldia_reflection_pdf");

    if (!stored) return null;

    try {
      return JSON.parse(stored) as ReflectionPdfData;
    } catch {
      return null;
    }
  });

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-6 text-stone-700">
        No hay reflexión cargada para exportar.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-4 text-stone-900 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-[#4f6740] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26351f]"
        >
          Imprimir / Guardar PDF
        </button>
      </div>

      <article className="mx-auto min-h-[297mm] max-w-[210mm] bg-white p-10 shadow-md print:min-h-screen print:max-w-none print:shadow-none">
        <header className="border-b border-[#5f6f52]/30 pb-6 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#4f6740]">
            PalabradelDía
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#26351f]">
            Reflexión del Evangelio
          </h1>

          <p className="mt-2 text-sm text-stone-500">{data.date || today}</p>
        </header>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#4f6740]">
            {data.gospelTitle || "Evangelio del día"}
          </h2>

          <div className="mt-4 rounded-2xl border border-[#5f6f52]/20 bg-[#f7f5ef] p-5">
            <p className="whitespace-pre-line text-[15px] leading-7 text-stone-800">
              {data.gospelText || "Texto del Evangelio no disponible."}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-[#4f6740]">
            Reflexión
          </h2>

          <div className="mt-4 rounded-2xl border border-[#5f6f52]/25 bg-[#dfe6d2]/45 p-5">
            <p className="whitespace-pre-line text-[15px] leading-7 text-stone-800">
              {data.reflectionText || "Sin reflexión escrita."}
            </p>
          </div>

          {data.authorName && (
            <p className="mt-3 text-right text-sm italic text-stone-500">
              — {data.authorName}
            </p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-[#4f6740]">
            Para continuar la reflexión en papel
          </h2>

          <div className="mt-4 space-y-6">
            <WritingBox title="¿Qué me dice hoy esta Palabra?" />
            <WritingBox title="¿Qué puedo cambiar o cuidar esta semana?" />
            <WritingBox title="Propósito concreto" />
            <WritingBox title="Oración personal" large />
          </div>
        </section>

        <footer className="mt-10 border-t border-[#5f6f52]/30 pt-4 text-center text-xs text-stone-400">
          Documento generado desde PalabradelDía
        </footer>
      </article>
    </main>
  );
}

function WritingBox({
  title,
  large = false,
}: {
  title: string;
  large?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-[#26351f]">{title}</p>
      <div
        className={`rounded-xl border border-dashed border-[#5f6f52]/35 bg-white ${
          large ? "h-44" : "h-28"
        }`}
      />
    </div>
  );
}
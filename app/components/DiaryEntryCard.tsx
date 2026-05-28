"use client";

import { useState } from "react";
import type { DiaryEntry, Gospel } from "../types";
import GospelPreview from "./GospelPreview";

type Theme = {
  mode?: string;
  card: string;
  innerCard: string;
  mutedButton: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  pill: string;
};

type DiaryEntryCardProps = {
  entry: DiaryEntry;
  theme: Theme;
  gospel?: Gospel;
  isGospelOpen: boolean;
  onDelete: (id: number | string) => void;
  onToggleShared: (id: number | string) => void;
  onToggleFavorite: (id: number | string) => void;
  onToggleGospel: (id: number | string) => void;
};

export default function DiaryEntryCard({
  entry,
  theme,
  gospel,
  isGospelOpen,
  onDelete,
  onToggleShared,
  onToggleFavorite,
  onToggleGospel,
}: DiaryEntryCardProps) {
  const [showTags, setShowTags] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const entryId = entry.id;
  const hasTags = entry.tags.length > 0;

  const sourceText =
    entry.source === "community"
      ? `Guardada de comunidad${entry.originalAuthor ? ` · ${entry.originalAuthor}` : ""}`
      : "Escrita por mí";

  const exportReflectionToPdf = () => {
    localStorage.setItem(
      "palabradeldia_reflection_pdf",
      JSON.stringify({
        gospelTitle: entry.gospelReference || "Evangelio del día",
        gospelText: gospel?.text || "",
        reflectionText: entry.text,
        authorName:
          entry.source === "community"
            ? entry.originalAuthor
              ? `Reflexión guardada de ${entry.originalAuthor}`
              : "Reflexión guardada de comunidad"
            : "Reflexión personal",
        date: entry.date,
      })
    );

    window.location.href = "/reflexion-pdf";
  };

  return (
    <article id={`reflection-${entry.id}`} className={`rounded-[2rem] border p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-[1px] ${theme.innerCard}`}>
      
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-bold ${theme.accentText}`}>
            {entry.date} · {entry.time}
          </p>

          <p className={`mt-1 text-xs font-medium uppercase tracking-[0.14em] ${theme.mutedText}`}>
  {sourceText}
</p>
        </div>

        <button
  onClick={() => setShowActions(!showActions)}
  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${theme.mutedButton}`}
>
  ···
</button>
      </div>

      <p className={`text-[1rem] leading-7 ${theme.bodyText}`}>{entry.text}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onToggleGospel(entryId)}
          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${theme.pill}`}
        >
          {isGospelOpen ? "Ocultar Evangelio" : entry.gospelReference}
        </button>

        {hasTags && (
          <button
            onClick={() => setShowTags(!showTags)}
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${theme.mutedButton}`}
          >
            {showTags ? "Ocultar etiquetas" : `Etiquetas · ${entry.tags.length}`}
          </button>
        )}

        {entry.favorite && (
          <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
            ★ Favorita
          </span>
        )}

        {entry.source === "own" && entry.shared && (
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
            Compartida
          </span>
        )}

        {entry.source === "own" && entry.shared && (
        <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${theme.pill}`}>
          ♥ {entry.likes ?? 0} me gusta
        </span>
        )}
        
      </div>

      {showTags && hasTags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag.id}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${theme.pill}`}
            >
              <span className="mr-1">{tag.emoji}</span>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {showActions && (
        <div className={`mt-4 flex flex-wrap gap-2 rounded-2xl border p-3 ${theme.innerCard}`}>
          <button
            onClick={() => onToggleFavorite(entryId)}
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
              entry.favorite
                ? "border-amber-200 bg-amber-100 text-amber-800"
                : theme.mutedButton
            }`}
          >
            {entry.favorite ? "Quitar favorita" : "Marcar favorita"}
          </button>

          {entry.source === "own" && (
            <button
              onClick={() => onToggleShared(entryId)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                entry.shared
                  ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                  : theme.mutedButton
              }`}
            >
              {entry.shared ? "Hacer privada" : "Compartir con la comunidad"}
            </button>
          )}

          <button
            onClick={exportReflectionToPdf}
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${theme.pill}`}
          >
            Exportar PDF
          </button>

          <button
            onClick={() => onDelete(entryId)}
            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Eliminar
          </button>
        </div>
      )}

      {isGospelOpen && <GospelPreview gospel={gospel} theme={theme} />}
    </article>
  );
}
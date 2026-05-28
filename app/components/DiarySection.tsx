"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DiaryEntry, Gospel } from "../types";
import DiaryEntryCard from "./DiaryEntryCard";
import DiaryFilters from "./DiaryFilters";
import DiarySkeleton from "./skeletons/DiarySkeleton";

type DiarySectionProps = {
  diaryEntries: DiaryEntry[];
  gospels: Gospel[];
  theme: {
    card: string;
    innerCard: string;
    softCard: string;
    primaryText: string;
    bodyText: string;
    mutedText: string;
    accentText: string;
    mutedButton: string;
    pill: string;
  };
  onDelete: (entryId: DiaryEntry["id"]) => void;
  onToggleShared: (entryId: DiaryEntry["id"]) => void;
  onToggleFavorite: (entryId: DiaryEntry["id"]) => void;
  openGospelEntryId: DiaryEntry["id"] | null;
  onToggleGospel: (entryId: DiaryEntry["id"]) => void;
  footer?: ReactNode;
  onGoToGospel?: () => void;
};

export default function DiarySection({
  diaryEntries,
  gospels,
  theme,
  onDelete,
  onToggleShared,
  onToggleFavorite,
  openGospelEntryId,
  onToggleGospel,
  footer,
  onGoToGospel,
}: DiarySectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<"all" | "own" | "community">(
    "all"
  );
  const [visibleLimit, setVisibleLimit] = useState(5);
  const [isLoadingDiary, setIsLoadingDiary] = useState(true);

  const usedTags = useMemo(() => {
    return Array.from(
      new Map(
        diaryEntries
          .flatMap((entry) => entry.tags)
          .map((tag) => [tag.id, tag])
      ).values()
    );
  }, [diaryEntries]);

  const visibleEntries = useMemo(() => {
    return diaryEntries.filter((entry) => {
      const matchesDate =
        selectedDate === "all" || entry.date === selectedDate;

      const matchesTag =
        selectedTagId === null ||
        entry.tags.some((tag) => String(tag.id) === selectedTagId);

      const matchesFavorite = !showOnlyFavorites || entry.favorite;

      const matchesSource =
        sourceFilter === "all" || entry.source === sourceFilter;

      return matchesDate && matchesTag && matchesFavorite && matchesSource;
    });
  }, [
    diaryEntries,
    selectedDate,
    selectedTagId,
    showOnlyFavorites,
    sourceFilter,
  ]);

  useEffect(() => {
    setVisibleLimit(5);
  }, [selectedDate, selectedTagId, showOnlyFavorites, sourceFilter]);

  useEffect(() => {
    setIsLoadingDiary(true);

    const timeout = window.setTimeout(() => {
      setIsLoadingDiary(false);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [diaryEntries.length, selectedTagId, showOnlyFavorites, sourceFilter]);

  const paginatedEntries = visibleEntries.slice(0, visibleLimit);
  const hasMoreEntries = visibleEntries.length > visibleLimit;
  const isDiaryCompletelyEmpty = diaryEntries.length === 0;

  function getGospelForEntry(entry: DiaryEntry) {
    return gospels.find((gospel) => gospel.date === entry.gospelDate);
  }

  if (isLoadingDiary) {
    return <DiarySkeleton theme={theme} />;
  }

  return (
    <section data-tour="diary-section" className="space-y-6">
      <div>
        <p
          className={`text-xs font-bold uppercase tracking-[0.5em] ${theme.accentText}`}
        >
          Diario de reflexiones
        </p>

        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Revisa tus meditaciones personales y las que has guardado de la
          comunidad.
        </p>
      </div>

      <DiaryFilters
        usedTags={usedTags}
        selectedTagId={selectedTagId}
        showOnlyFavorites={showOnlyFavorites}
        sourceFilter={sourceFilter}
        onSelectTag={setSelectedTagId}
        onShowOnlyFavoritesChange={setShowOnlyFavorites}
        onSourceFilterChange={setSourceFilter}
        theme={theme}
      />

      {visibleEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`rounded-[2rem] border p-7 text-center shadow-sm ${theme.card}`}
        >
          {isDiaryCompletelyEmpty ? (
            <>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}
              >
                Tu diario empieza aquí
              </p>

              <h3 className={`mt-3 text-xl font-bold ${theme.primaryText}`}>
                Todavía no has escrito ninguna reflexión
              </h3>

              <p
                className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${theme.bodyText}`}
              >
                Puedes empezar leyendo el Evangelio de hoy y guardando una
                primera meditación. No tienes que compartirla si no quieres.
              </p>

              {onGoToGospel && (
                <button
                  type="button"
                  onClick={onGoToGospel}
                  className={`mt-5 rounded-full px-5 py-3 text-sm font-bold shadow-sm transition ${theme.mutedButton}`}
                >
                  Ir al Evangelio
                </button>
              )}
            </>
          ) : (
            <>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}
              >
                Sin resultados
              </p>

              <h3 className={`mt-3 text-xl font-bold ${theme.primaryText}`}>
                No hay reflexiones con estos filtros
              </h3>

              <p
                className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${theme.bodyText}`}
              >
                Prueba a cambiar la etiqueta, mostrar todas las reflexiones o
                revisar también las guardadas desde la comunidad.
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {paginatedEntries.map((entry) => {
              const gospel = getGospelForEntry(entry);
              const isGospelOpen = openGospelEntryId === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <DiaryEntryCard
                    entry={entry}
                    theme={theme}
                    gospel={gospel}
                    isGospelOpen={isGospelOpen}
                    onDelete={onDelete}
                    onToggleShared={onToggleShared}
                    onToggleFavorite={onToggleFavorite}
                    onToggleGospel={onToggleGospel}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {hasMoreEntries && (
            <motion.button
              type="button"
              onClick={() => setVisibleLimit((current) => current + 5)}
              whileTap={{ scale: 0.98 }}
              className={`mx-auto mt-5 block rounded-full border px-5 py-3 text-sm font-semibold shadow-sm transition ${theme.mutedButton}`}
            >
              Mostrar 5 reflexiones más
            </motion.button>
          )}

          {footer && <div className="mt-6">{footer}</div>}
        </>
      )}
    </section>
  );
}
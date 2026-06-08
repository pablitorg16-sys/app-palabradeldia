// v2
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DiaryEntry, Gospel } from "../types";
import DiaryEntryCard from "./DiaryEntryCard";
import DiaryFilters from "./DiaryFilters";
import DiarySkeleton from "./skeletons/DiarySkeleton";
import { getLiturgicalDaysByDates } from "../utils/liturgicalDays";
import { getThemeClasses } from "../utils/theme";
import { BookOpen, Notebook, Pencil, Heart } from "lucide-react";

type DiarySectionProps = {
  diaryEntries: DiaryEntry[];
  gospels: Gospel[];
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
  onDelete,
  onToggleShared,
  onToggleFavorite,
  openGospelEntryId,
  onToggleGospel,
  footer,
  onGoToGospel,
}: DiarySectionProps) {
  const theme = getThemeClasses();

  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<"all" | "own" | "community">("all");
  const [visibleLimit, setVisibleLimit] = useState(5);
  const [isLoadingDiary, setIsLoadingDiary] = useState(true);
  const [supabaseGospels, setSupabaseGospels] = useState<Gospel[]>([]);

  const usedTags = useMemo(() => {
    return Array.from(
      new Map(diaryEntries.flatMap((e) => e.tags).map((tag) => [tag.id, tag])).values()
    );
  }, [diaryEntries]);

  const visibleEntries = useMemo(() => {
    return diaryEntries.filter((entry) => {
      const matchesDate   = selectedDate === "all" || entry.date === selectedDate;
      const matchesTag    = selectedTagId === null || entry.tags.some((t) => String(t.id) === selectedTagId);
      const matchesFav    = !showOnlyFavorites || entry.favorite;
      const matchesSource = sourceFilter === "all" || entry.source === sourceFilter;
      return matchesDate && matchesTag && matchesFav && matchesSource;
    });
  }, [diaryEntries, selectedDate, selectedTagId, showOnlyFavorites, sourceFilter]);

  useEffect(() => { setVisibleLimit(5); }, [selectedDate, selectedTagId, showOnlyFavorites, sourceFilter]);

  useEffect(() => {
    setIsLoadingDiary(true);
    const timeout = window.setTimeout(() => setIsLoadingDiary(false), 400);
    return () => window.clearTimeout(timeout);
  }, [diaryEntries.length, selectedTagId, showOnlyFavorites, sourceFilter]);

  function normalizeGospelDate(date?: string) {
    if (!date) return "";
    if (date.includes("-")) return date;
    const [day, month, year] = date.split("/");
    if (!day || !month || !year) return date;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const gospelDates = useMemo(() => {
    return Array.from(new Set(diaryEntries.map((e) => normalizeGospelDate(e.gospelDate)).filter(Boolean)));
  }, [diaryEntries]);

  useEffect(() => {
    async function loadAssociatedGospels() {
      const loaded = await getLiturgicalDaysByDates(gospelDates);
      setSupabaseGospels(loaded);
    }
    void loadAssociatedGospels();
  }, [gospelDates]);

  const availableGospels = useMemo(() => {
    const byDate = new Map<string, Gospel>();
    [...supabaseGospels, ...gospels].forEach((g) => byDate.set(normalizeGospelDate(g.date), g));
    return Array.from(byDate.values());
  }, [supabaseGospels, gospels]);

  function getGospelForEntry(entry: DiaryEntry) {
    const normalized = normalizeGospelDate(entry.gospelDate);
    return (
      availableGospels.find((g) => normalizeGospelDate(g.date) === normalized) ??
      availableGospels.find((g) => g.reference === entry.gospelReference)
    );
  }

  const paginatedEntries = visibleEntries.slice(0, visibleLimit);
  const hasMoreEntries = visibleEntries.length > visibleLimit;
  const isDiaryCompletelyEmpty = diaryEntries.length === 0;

  if (isLoadingDiary) return <DiarySkeleton />;

  return (
    <section data-tour="diary-section" className="space-y-6">
      <div>
        <p className={`text-xs font-bold uppercase tracking-[0.5em] ${theme.accentText}`}>
          Diario de reflexiones
        </p>
        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Revisa tus meditaciones personales y las que has guardado de la comunidad.
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
      />

      {visibleEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`rounded-[2rem] border p-7 shadow-sm ${theme.card}`}
        >
          {isDiaryCompletelyEmpty ? (
            <>
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-[1.25rem] border ${theme.innerCard}`}>
                <Notebook size={28} className={theme.accentText} />
              </div>

              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.accentText}`}>
                Tu diario empieza aquí
              </p>

              <h3 className={`mt-2 text-xl font-bold ${theme.primaryText}`}>
                Escribe tu primera reflexión
              </h3>

              <p className={`mt-3 text-sm leading-7 ${theme.bodyText}`}>
                Lee el Evangelio de hoy, detente un momento y escribe lo que te inspira. No hace falta que sea largo — una sola frase ya cuenta.
              </p>

              {onGoToGospel && (
                <button
                  type="button"
                  onClick={onGoToGospel}
                  className={`mt-6 w-full rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition ${theme.button}`}
                >
                  Leer el Evangelio de hoy
                </button>
              )}

              <div className="mt-6 flex items-center gap-3">
                <div className={`h-px flex-1 ${theme.divider}`} />
                <p className={`text-xs ${theme.mutedText}`}>cómo funciona</p>
                <div className={`h-px flex-1 ${theme.divider}`} />
              </div>

              <div className="mt-5 space-y-4">
                {[
                  { icon: <BookOpen size={14} />, label: "Lee el Evangelio", desc: "Cada día hay una lectura esperándote." },
                  { icon: <Pencil size={14} />, label: "Escribe lo que sientes", desc: "Tu reflexión es personal. Compártela o guárdala solo para ti." },
                  { icon: <Heart size={14} />, label: "Construye un hábito", desc: "Tu diario crece contigo. Cada reflexión es un paso en tu camino." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${theme.innerCard}`}>
                      <span className={theme.accentText}>{item.icon}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${theme.primaryText}`}>{item.label}</p>
                      <p className={`mt-0.5 text-xs leading-5 ${theme.mutedText}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>
                Sin resultados
              </p>
              <h3 className={`mt-3 text-xl font-bold ${theme.primaryText}`}>
                No hay reflexiones con estos filtros
              </h3>
              <p className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${theme.bodyText}`}>
                Prueba a cambiar la etiqueta o mostrar todas las reflexiones.
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {paginatedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <DiaryEntryCard
                  entry={entry}
                  gospel={getGospelForEntry(entry)}
                  isGospelOpen={openGospelEntryId === entry.id}
                  onDelete={onDelete}
                  onToggleShared={onToggleShared}
                  onToggleFavorite={onToggleFavorite}
                  onToggleGospel={onToggleGospel}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {hasMoreEntries && (
            <motion.button
              type="button"
              onClick={() => setVisibleLimit((c) => c + 5)}
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
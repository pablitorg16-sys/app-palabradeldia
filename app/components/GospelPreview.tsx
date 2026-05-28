import { motion } from "framer-motion";
import type { Gospel } from "../types";

type Theme = {
  card: string;
  innerCard: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
};

type GospelPreviewProps = {
  gospel?: Gospel;
  theme?: Theme;
};

export default function GospelPreview({ gospel, theme }: GospelPreviewProps) {
  if (!gospel || !gospel.text?.trim()) {
    return (
      <p className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
        No se ha encontrado el Evangelio asociado.
      </p>
    );
  }

  const containerClass = theme
    ? `mt-6 overflow-hidden rounded-[2rem] border shadow-sm backdrop-blur ${theme.innerCard}`
    : "mt-6 overflow-hidden rounded-[2rem] border border-[#5f6f52]/20 bg-[#f4f1e8]/55 shadow-sm backdrop-blur";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className={containerClass}
    >
      <div className="border-b border-[#5f6f52]/10 px-5 py-4">
        <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.24em] ${theme?.accentText ?? "text-[#4f6740]"}`}>
          Evangelio asociado
        </p>

        <h3 className={`text-lg font-bold ${theme?.primaryText ?? "text-[#26351f]"}`}>
          {gospel.reference}
        </h3>

        <p className={`mt-1 text-sm italic ${theme?.accentText ?? "text-[#4f6740]"}`}>
          “{gospel.title}”
        </p>
      </div>

      <div className="px-5 py-5">
        <p className={`text-[0.98rem] leading-8 ${theme?.bodyText ?? "text-stone-700"}`}>
          {gospel.text}
        </p>
      </div>
    </motion.div>
  );
}

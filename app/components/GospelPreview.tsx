"use client";

import { motion } from "framer-motion";
import type { Gospel } from "../types";
import { getThemeClasses } from "../utils/theme";

type GospelPreviewProps = {
  gospel?: Gospel;
};

export default function GospelPreview({ gospel }: GospelPreviewProps) {
  const theme = getThemeClasses();

  if (!gospel || !gospel.text?.trim()) {
    return (
      <p className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
        No se ha encontrado el Evangelio asociado.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className={`mt-6 overflow-hidden rounded-[2rem] border shadow-sm backdrop-blur ${theme.innerCard}`}
    >
      <div className="border-b border-[#5f6f52]/10 px-5 py-4">
        <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.24em] ${theme.accentText}`}>
          Evangelio asociado
        </p>
        <h3 className={`text-lg font-bold ${theme.primaryText}`}>{gospel.reference}</h3>
        <p className={`mt-1 text-sm italic ${theme.accentText}`}>"{gospel.title}"</p>
      </div>

      <div className="px-5 py-5">
        <p className={`text-[0.98rem] leading-8 ${theme.bodyText}`}>{gospel.text}</p>
      </div>
    </motion.div>
  );
}
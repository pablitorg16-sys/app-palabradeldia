"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getThemeClasses } from "../utils/theme";
import { getSaintsByDate, formatSaintDates, type Saint } from "../utils/saintsOfDay";

type SaintsOfDayProps = {
  date: string;
};

function SaintEntry({ saint }: { saint: Saint }) {
  const theme = getThemeClasses();
  const [isOpen, setIsOpen] = useState(false);
  const datesLine = formatSaintDates(saint);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-center"
      >
        <span
          className={`text-xs leading-relaxed ${theme.mutedText}`}
          style={{ fontFamily: "var(--font-ui, sans-serif)" }}
        >
          <span className="font-semibold">{saint.name}</span> — {saint.role}
        </span>
        {isOpen ? (
          <ChevronUp size={13} className={`shrink-0 ${theme.mutedText}`} />
        ) : (
          <ChevronDown size={13} className={`shrink-0 ${theme.mutedText}`} />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 max-w-sm space-y-2 pb-1 text-center">
          {datesLine && (
            <p
              className={`text-xs leading-relaxed opacity-80 ${theme.mutedText}`}
              style={{ fontFamily: "var(--font-ui, sans-serif)" }}
            >
              {datesLine}
            </p>
          )}

          <p
            className={`text-[13px] leading-relaxed ${theme.bodyText}`}
            style={{ fontFamily: "var(--font-body, Georgia, serif)" }}
          >
            {saint.summary}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SaintsOfDay({ date }: SaintsOfDayProps) {
  const [saints, setSaints] = useState<Saint[]>([]);

  useEffect(() => {
    let cancelled = false;
    getSaintsByDate(date).then((result) => {
      if (!cancelled) setSaints(result);
    });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (saints.length === 0) return null;

  return (
    <div className="mt-2 flex flex-col items-center gap-1">
      {saints.slice(0, 3).map((saint) => (
        <SaintEntry key={saint.name} saint={saint} />
      ))}
    </div>
  );
}

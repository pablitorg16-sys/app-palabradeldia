import type { DiaryEntry } from "../types";

type DiaryStatsProps = {
  diaryEntries: DiaryEntry[];
  theme: {
    card: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
  };
};

export default function DiaryStats({
  diaryEntries,
  theme,
}: DiaryStatsProps) {
  const totalEntries = diaryEntries.length;

  const sharedEntries = diaryEntries.filter(
    (entry) => entry.shared
  ).length;

  const favoriteEntries = diaryEntries.filter(
    (entry) => entry.favorite
  ).length;

  const stats = [
    {
      label: "Reflexiones",
      value: totalEntries,
    },
    {
      label: "Compartidas",
      value: sharedEntries,
    },
    {
      label: "Favoritas",
      value: favoriteEntries,
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-3">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={`rounded-[1.7rem] border p-4 text-center shadow-sm backdrop-blur sm:rounded-3xl sm:p-5 ${theme.card}`}
        >
          <p className={`text-2xl font-bold sm:text-3xl ${theme.primaryText}`}>
            {stat.value}
          </p>

          <p
            className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.18em] ${theme.accentText}`}
          >
            {stat.label}
          </p>
        </article>
      ))}
    </section>
  );
}
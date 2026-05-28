import type { Gospel } from "../types";

type GospelCardProps = {
  gospel: Gospel;
  theme: {
    card: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
    pill: string;
  };
};

export default function GospelCard({ gospel, theme }: GospelCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[2rem] border px-5 py-6 shadow-sm backdrop-blur sm:rounded-[2.25rem] sm:px-10 sm:py-10 ${theme.card}`}
    >
      <div
        className="absolute inset-0 opacity-[0.045] sm:opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 12%, rgba(255,255,255,0.75) 0 1px, transparent 1px),
            radial-gradient(circle at 78% 78%, rgba(38,53,31,0.18) 0 1px, transparent 1px),
            linear-gradient(135deg, rgba(255,255,255,0.34), transparent 48%, rgba(38,53,31,0.12))
          `,
          backgroundSize: "18px 18px, 24px 24px, 100% 100%",
        }}
      />

      <div className="absolute left-6 top-24 hidden h-28 w-px bg-[#5f6f52]/20 sm:block" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <p
            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.28em] ${theme.pill}`}
          >
            Evangelio del día
          </p>

          <p className={`shrink-0 text-xs font-semibold sm:text-sm ${theme.accentText}`}>
            {new Date(gospel.date).toLocaleDateString("es-ES")}
          </p>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:gap-x-3">
            <p
              className={`text-sm font-bold uppercase tracking-[0.18em] sm:text-lg sm:tracking-[0.22em] ${theme.accentText}`}
            >
              {gospel.reference}
            </p>

            <p className={`text-sm italic sm:text-lg ${theme.accentText}`}>
              “{gospel.title}”
            </p>
          </div>
        </div>

        <blockquote
          className={`max-w-3xl text-[1rem] font-normal leading-7 tracking-[-0.01em] sm:text-[1.18rem] sm:leading-9 ${theme.bodyText}`}
        >
          {gospel.text}
        </blockquote>
      </div>
    </article>
  );
}
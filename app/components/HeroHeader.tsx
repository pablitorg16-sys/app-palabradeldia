type HeroHeaderProps = {
  theme: {
    card: string;
    accentText: string;
    primaryText: string;
  };
};

export default function HeroHeader({ theme }: HeroHeaderProps) {
  return (
    <header
      className={`mb-6 rounded-3xl border p-5 shadow-sm backdrop-blur sm:mb-8 sm:p-8 ${theme.card}`}
    >
      <p
        className={`mb-3 text-sm font-semibold uppercase tracking-[0.3em] ${theme.accentText}`}
      >
          
      </p>
      <h1
        className={`text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${theme.primaryText}`}
      >
        Y el Verbo se hizo carne
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-stone-600">
        Lee la Palabra del día, escribe reflexiones y guarda tu camino
        espiritual.
      </p>
    </header>
  );
}
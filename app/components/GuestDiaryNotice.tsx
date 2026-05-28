type GuestDiaryNoticeProps = {
  onOpenAuth: (mode: "signup" | "login") => void;
  theme: {
    card: string;
    button: string;
    accentText: string;
    bodyText: string;
  };
};

export default function GuestDiaryNotice({
  onOpenAuth,
  theme,
}: GuestDiaryNoticeProps) {
  return (
    <section className={`rounded-3xl border p-5 shadow-sm backdrop-blur ${theme.card}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}>
            Modo invitado
          </p>

          <p className={`mt-2 max-w-2xl leading-7 ${theme.bodyText}`}>
            Tus reflexiones se guardan únicamente en este dispositivo. Crea una
            cuenta para sincronizarlas y no perderlas.
          </p>
        </div>

        <button
          onClick={() => onOpenAuth("signup")}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${theme.button}`}
        >
          Crear cuenta
        </button>
      </div>
    </section>
  );
}
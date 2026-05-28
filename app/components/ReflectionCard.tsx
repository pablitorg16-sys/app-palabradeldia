function Question({ text }: { text: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-stone-100/80 px-4 py-4 text-left text-sm transition hover:bg-stone-200">
      <span>{text}</span>
      <span>›</span>
    </button>
  );
}

export default function ReflectionCard() {
  return (
    <section className="space-y-8">
      <article className="rounded-3xl border border-stone-300 bg-white/70 p-7 shadow-sm backdrop-blur">
        <h3 className="mb-5 text-xl font-bold">Reflexión del día</h3>

        <p className="leading-8 text-stone-700">
          Jesús nos regala una paz diferente, una que no entiende de
          circunstancias. Es una paz que sostiene, que calma y que viene de
          confiar en Él.
        </p>

        <h4 className="mb-4 mt-8 font-bold">Preguntas para meditar</h4>

        <div className="space-y-3">
          <Question text="¿Qué cosas te quitan la paz?" />
          <Question text="¿Cómo puedes confiar más en Jesús hoy?" />
        </div>

        <button className="mt-8 w-full rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
          Escribir reflexión
        </button>
      </article>

      <article className="rounded-3xl border border-stone-300 bg-white/70 p-7 shadow-sm backdrop-blur">
        <h3 className="mb-5 text-xl font-bold">Oración del día</h3>

        <p className="leading-8 text-stone-700">
          Señor, gracias por tu paz que me acompaña cada día. Ayúdame a confiar
          más en Ti y a ser instrumento de tu paz para los demás. Amén.
        </p>

        <button className="mt-6 text-sm font-semibold text-emerald-950">
          Guardar oración
        </button>
      </article>
    </section>
  );
}

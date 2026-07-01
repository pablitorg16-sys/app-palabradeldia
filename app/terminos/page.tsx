import { getThemeClasses } from "../utils/theme";

export const metadata = {
  title: "Términos de uso · PalabradelDía",
};

export default function TerminosPage() {
  const theme = getThemeClasses();

  return (
    <main className={`min-h-screen px-4 py-12 sm:px-6 sm:py-16 ${theme.page}`}>
      <article className="mx-auto max-w-2xl">
        <header className="mb-10">
          <a
            href="/"
            className={`mb-8 inline-block text-sm font-semibold transition hover:opacity-70 ${theme.accentText}`}
          >
            &#8592; Volver a la app
          </a>
          <h1
            className={`mt-6 text-3xl font-medium italic sm:text-4xl ${theme.primaryText}`}
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            T&#233;rminos de uso
          </h1>
          <p className={`mt-3 text-sm ${theme.mutedText}`}>
            &#218;ltima actualizaci&#243;n: julio de 2025
          </p>
        </header>

        <div
          className={`space-y-8 text-[1rem] leading-[1.85] ${theme.bodyText}`}
          style={{ fontFamily: "var(--font-body, Georgia, serif)" }}
        >
          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Sobre la app
            </h2>
            <p>
              PalabradelD&#237;a es una aplicaci&#243;n de uso personal para la reflexi&#243;n sobre el
              Evangelio del d&#237;a. Actualmente se encuentra en fase beta: puede tener errores
              y las funcionalidades pueden cambiar. Se ofrece de forma gratuita y sin
              garant&#237;as de disponibilidad continuada.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Uso adecuado de la comunidad
            </h2>
            <p>
              La comunidad de PalabradelD&#237;a es un espacio para compartir reflexiones
              espirituales con respeto y sinceridad. Al usar la app aceptas no publicar:
            </p>
            <ul className="mt-3 space-y-2 pl-5" style={{ listStyleType: "disc" }}>
              <li>Contenido ofensivo, discriminatorio o que falte al respeto a otras personas.</li>
              <li>Spam, publicidad o contenido no relacionado con la reflexi&#243;n espiritual.</li>
              <li>Contenido ilegal o que vulnere derechos de terceros.</li>
            </ul>
            <p className="mt-3">
              Nos reservamos el derecho de eliminar contenido que incumpla estas normas y, en
              casos graves, de suspender la cuenta responsable.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Tu contenido, tu responsabilidad
            </h2>
            <p>
              Las reflexiones que escribes y compartes son tuyas. T&#250; eres responsable de lo
              que publicas en la comunidad. Al compartir una reflexi&#243;n aceptas que otros
              usuarios registrados puedan verla dentro de la app.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              La app se ofrece &#171;tal cual&#187;
            </h2>
            <p>
              PalabradelD&#237;a se ofrece en fase beta, sin garant&#237;as de ningún tipo. Hacemos lo
              posible por mantenerla disponible y sin errores, pero no podemos garantizar un
              servicio ininterrumpido. No nos hacemos responsables de p&#233;rdidas de datos ni
              de da&#241;os derivados del uso de la app.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Tu cuenta y tus datos
            </h2>
            <p>
              Puedes dejar de usar PalabradelD&#237;a en cualquier momento. Si quieres borrar tu
              cuenta y todos tus datos, escr&#237;benos a{" "}
              <a
                href="mailto:pablito.rg16@gmail.com"
                className={`font-semibold underline underline-offset-2 ${theme.accentText}`}
              >
                pablito.rg16@gmail.com
              </a>{" "}
              y lo gestionamos sin problem a alguno.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Cambios en los t&#233;rminos
            </h2>
            <p>
              Podemos actualizar estos t&#233;rminos si la app evoluciona. La fecha de &#171;&#218;ltima
              actualizaci&#243;n&#187; en la cabecera siempre indica la versi&#243;n vigente. Si los cambios
              son relevantes, lo notificaremos en la app.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>Contacto</h2>
            <p>
              ¿Preguntas o sugerencias? Escr&#237;benos a{" "}
              <a
                href="mailto:pablito.rg16@gmail.com"
                className={`font-semibold underline underline-offset-2 ${theme.accentText}`}
              >
                pablito.rg16@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

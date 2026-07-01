import { getThemeClasses } from "../utils/theme";

export const metadata = {
  title: "Política de privacidad · PalabradelDía",
};

export default function PrivacidadPage() {
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
            Pol&#237;tica de privacidad
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
              Qu&#233; es PalabradelD&#237;a
            </h2>
            <p>
              PalabradelD&#237;a es una aplicaci&#243;n de reflexi&#243;n diaria sobre el Evangelio. Puedes
              leer el texto del d&#237;a, escribir una reflexi&#243;n personal en tu diario privado y,
              si lo deseas, compartirla con la comunidad de la app. Est&#225; en fase beta y se
              ofrece de forma gratuita.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Qu&#233; datos recogemos
            </h2>
            <p>Cuando usas PalabradelD&#237;a podemos recoger los siguientes datos:</p>
            <ul className="mt-3 space-y-2 pl-5" style={{ listStyleType: "disc" }}>
              <li>
                <strong>Cuenta:</strong> si te registras con Google, recibimos tu direcci&#243;n de
                email y tu nombre tal como aparecen en tu cuenta de Google.
              </li>
              <li>
                <strong>Perfil:</strong> nombre de usuario, biograf&#237;a (opcional) y avatar que
                eliges dentro de la app.
              </li>
              <li>
                <strong>Reflexiones:</strong> los textos que escribes en tu diario. Si decides
                compartirlos en comunidad, son visibles para otros usuarios registrados.
              </li>
              <li>
                <strong>Actividad social:</strong> a qui&#233;n sigues, qu&#233; reflexiones marcas como
                favoritas y los comentarios que dejas.
              </li>
              <li>
                <strong>Almacenamiento local:</strong> si usas la app sin cuenta, tus reflexiones
                se guardan &#250;nicamente en el navegador de tu dispositivo (localStorage). La
                preferencia de tema visual tambi&#233;n se guarda localmente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Para qu&#233; usamos tus datos
            </h2>
            <ul className="mt-3 space-y-2 pl-5" style={{ listStyleType: "disc" }}>
              <li>Autenticarte y mantener tu sesi&#243;n abierta.</li>
              <li>Mostrar tu perfil y tus reflexiones en la comunidad (solo las que compartes).</li>
              <li>Sincronizar tu diario entre dispositivos cuando tienes cuenta.</li>
              <li>Enviarte notificaciones dentro de la app (me gustas, comentarios, nuevos seguidores).</li>
            </ul>
            <p className="mt-3">
              No usamos tus datos para publicidad, no los vendemos a terceros y no los
              compartimos con nadie ajeno a la operaci&#243;n t&#233;cnica de la app.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              D&#243;nde se almacenan
            </h2>
            <p>
              Los datos de las cuentas y las reflexiones compartidas se almacenan en{" "}
              <strong>Supabase</strong>, un proveedor de base de datos y autenticaci&#243;n con
              servidores en Europa. El inicio de sesi&#243;n con Google se gestiona a trav&#233;s de{" "}
              <strong>Supabase Auth</strong>; Google &#250;nicamente nos proporciona tu email y
              nombre para crear tu cuenta, no tiene acceso a tus reflexiones.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Tus derechos
            </h2>
            <p>
              Puedes solicitar el acceso, la correcci&#243;n o el borrado completo de tu cuenta y
              todos tus datos en cualquier momento escribiendo a{" "}
              <a
                href="mailto:pablito.rg16@gmail.com"
                className={`font-semibold underline underline-offset-2 ${theme.accentText}`}
              >
                pablito.rg16@gmail.com
              </a>
              . Atenderemos tu solicitud en un plazo razonable.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>
              Cambios en esta pol&#237;tica
            </h2>
            <p>
              Si hacemos cambios relevantes en c&#243;mo tratamos tus datos, lo comunicaremos en la
              app. La fecha de &#171;&#218;ltima actualizaci&#243;n&#187; en la cabecera de esta p&#225;gina
              siempre refleja la versi&#243;n vigente.
            </p>
          </section>

          <section>
            <h2 className={`mb-3 text-lg font-semibold ${theme.primaryText}`}>Contacto</h2>
            <p>
              Para cualquier duda sobre privacidad escribe a{" "}
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

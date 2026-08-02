# AGENTS.md — Reglas para PalabradelDía

Este es un proyecto Next.js 16 (App Router) + Supabase + Tailwind 4,
en producción. El propietario NO es programador profesional: prioriza
cambios explicados, reversibles y verificados sobre soluciones rápidas.

## Antes de tocar nada
- Explica qué vas a cambiar y en qué archivos ANTES de editar.
- En tareas ambiguas o de varios pasos, párate tras el diagnóstico y
  espera confirmación antes de modificar código.

## Zonas protegidas (NO tocar sin avisar primero)
- app/context/ThemeContext.tsx y las variables de tema (--color-*) en
  app/globals.css: el sistema de 4 temas (día/amanecer/atardecer/noche)
  es una decisión de diseño deliberada. No lo simplifiques ni lo
  reemplaces.
- app/utils/theme.ts, next.config.ts.
- La lógica de carga del evangelio (useTodayGospel, liturgicalDays,
  bible.ts): ha dado bugs en producción, cualquier cambio ahí se
  explica y se verifica antes.

## Git y despliegue
- NUNCA hagas commit ni push sin confirmación explícita.
- La rama de producción es `beta-v1`. No empujes a `main`.
- Recuerda que tras cada push hace falta "Promote to Production" manual
  en Vercel; no asumas que el push despliega solo.
- Un commit = un cambio con un mensaje que describa lo que realmente hace.
  No mezcles cambios no relacionados bajo un mismo mensaje.

## Verificación
- Ejecuta `npx tsc --noEmit` después de cada cambio y no lo des por
  bueno si hay errores de tipos.
- Para archivos de más de ~100 líneas o cambios visuales, deja que el
  propietario lo pruebe en local (`npm run dev`) antes de subir.

## Datos y textos
- NO inventes datos (fechas litúrgicas, referencias bíblicas, textos de
  evangelio, nombres de columnas de Supabase). Si no puedes verificar un
  dato, párate y pregunta.
- Al escribir texto visible en español, usa caracteres UTF-8 normales
  (á, é, í, ó, ú, ñ), nunca entidades HTML como &#243;.

## Estilo
- Iconos con lucide-react, nunca emojis como iconos.
- Reutiliza componentes existentes en vez de crear nuevos cuando sea
  posible.
- Da el contenido completo de los archivos que modifiques, no fragmentos
  sueltos.
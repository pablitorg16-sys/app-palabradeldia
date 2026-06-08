"use client";

import { useRef, useState, useEffect } from "react";
import { getThemeClasses } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";

type ShareTheme = "day" | "night" | "sunrise" | "sunset";

type ShareReflectionModalProps = {
  text: string;
  gospelReference: string;
  gospelDate: string;
  authorUsername: string;
  onClose: () => void;
};

const MAX_CHARS = 280;

const shareThemes: { id: ShareTheme; label: string; bg: string; card: string; text: string; muted: string; accent: string }[] = [
  { id: "day",     label: "Día",       bg: "#e7eadf", card: "#f8faf2", text: "#26351f", muted: "#78716c", accent: "#4f6740" },
  { id: "night",   label: "Noche",     bg: "#202822", card: "#2d372f", text: "#f4f1e8", muted: "#b9c2b0", accent: "#c8d2bf" },
  { id: "sunrise", label: "Amanecer",  bg: "#efe5d6", card: "#fff7ed", text: "#3f2f22", muted: "#78716c", accent: "#8a5a32" },
  { id: "sunset",  label: "Atardecer", bg: "#e8ddd2", card: "#f7eadf", text: "#3b2a22", muted: "#78716c", accent: "#7a4f35" },
];

function formatGospelDate(dateStr: string): string {
  try {
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const parts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/").reverse();
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export default function ShareReflectionModal({
  text,
  gospelReference,
  gospelDate,
  authorUsername,
  onClose,
}: ShareReflectionModalProps) {
  const appTheme = getThemeClasses();
  const { theme: dayPeriod } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<ShareTheme>(dayPeriod);
  const [isSharing, setIsSharing] = useState(false);

  const needsTrimming = text.length > MAX_CHARS;
  const [start, setStart] = useState(0);

  const selectedText = needsTrimming
    ? text.slice(start, start + MAX_CHARS)
    : text;

  const maxStart = Math.max(0, text.length - MAX_CHARS);

  const currentShareTheme = shareThemes.find((t) => t.id === selectedTheme) ?? shareThemes[0];
  const formattedDate = formatGospelDate(gospelDate);

  useEffect(() => {
    drawCanvas();
  }, [selectedTheme, selectedText]);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (const word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line.trim(), x, currentY);
        line = word + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = currentShareTheme;
    const pad = 80;

    // Fondo
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);

    // Tarjeta interior
    ctx.fillStyle = t.card;
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 48);
    ctx.fill();

    // Header — PalabradelDía
    ctx.fillStyle = t.accent;
    ctx.font = "600 32px system-ui, -apple-system, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("PALABRADELDIA", pad + 60, pad + 80);

    // Username
    ctx.fillStyle = t.muted;
    ctx.font = "400 28px system-ui, -apple-system, sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText(`@${authorUsername}`, pad + 60, pad + 124);

    // Línea divisora
    ctx.strokeStyle = t.accent + "33";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad + 60, pad + 150);
    ctx.lineTo(W - pad - 60, pad + 150);
    ctx.stroke();

    // Fecha del Evangelio
    ctx.fillStyle = t.accent;
    ctx.font = "600 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(`Reflexión del Evangelio del ${formattedDate}`, pad + 60, pad + 210);

    // Referencia
    ctx.fillStyle = t.muted;
    ctx.font = "400 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(gospelReference, pad + 60, pad + 250);

    // Línea divisora 2
    ctx.strokeStyle = t.accent + "22";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad + 60, pad + 280);
    ctx.lineTo(W - pad - 60, pad + 280);
    ctx.stroke();

    // Texto de la reflexión
    ctx.fillStyle = t.text;
    ctx.font = "400 36px Georgia, serif";
    wrapText(ctx, `"${selectedText}"`, pad + 60, pad + 350, W - pad * 2 - 120, 56);
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSharing(true);
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "reflexion-palabradeldia.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "PalabradelDía",
            text: `Reflexión del Evangelio del ${formattedDate}`,
          });
        } else {
          // Fallback: descarga directa
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "reflexion-palabradeldia.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsSharing(false);
      }, "image/png");
    } catch {
      setIsSharing(false);
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border p-6 shadow-2xl ${appTheme.card}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className={`text-lg font-bold ${appTheme.primaryText}`}>Compartir reflexión</h2>
          <button onClick={onClose} className={`rounded-full px-3 py-1 text-sm font-bold ${appTheme.mutedButton}`}>✕</button>
        </div>

        {/* Preview */}
        <canvas
          ref={canvasRef}
          className="mb-5 w-full rounded-2xl border"
          style={{ aspectRatio: "1/1" }}
        />

        {/* Selector de tema */}
        <div className="mb-5">
          <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${appTheme.accentText}`}>Tema</p>
          <div className="grid grid-cols-4 gap-2">
            {shareThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTheme(t.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedTheme === t.id ? appTheme.button : appTheme.mutedButton
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de fragmento si supera el máximo */}
        {needsTrimming && (
          <div className="mb-5">
            <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${appTheme.accentText}`}>
              Fragmento ({MAX_CHARS} caracteres máx.)
            </p>
            <p className={`mb-3 text-xs leading-5 ${appTheme.mutedText}`}>
              Tu reflexión supera el máximo. Desliza para elegir qué parte compartir.
            </p>
            <input
              type="range"
              min={0}
              max={maxStart}
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              className="w-full"
            />
            <p className={`mt-2 text-xs ${appTheme.mutedText}`}>
              "{selectedText.slice(0, 40)}..."
            </p>
          </div>
        )}

        {/* Botón compartir */}
        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className={`w-full rounded-2xl px-5 py-3 text-sm font-bold transition disabled:opacity-50 ${appTheme.button}`}
        >
          {isSharing ? "Generando..." : "Compartir imagen"}
        </button>
      </section>
    </div>
  );
}
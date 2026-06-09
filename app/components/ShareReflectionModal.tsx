"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { getThemeClasses } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";

type ShareTheme = "day" | "night" | "sunrise" | "sunset";
type TextMode = "full" | "shrink" | "fragment";

type ShareReflectionModalProps = {
  text: string;
  gospelReference: string;
  gospelDate: string;
  authorUsername: string;
  sharerUsername: string;
  onClose: () => void;
};

const LOGO_B64 = "PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMTIiIGZpbGw9IndoaXRlIi8+CiAgPHBhdGggZD0iTTI1NiAzNjVDMjIzIDMyMiAxNzQgMzA2IDEwNSAzMjZWMTcxQzE2NyAxNTMgMjE4IDE2NyAyNTYgMjExVjM2NVoiIHN0cm9rZT0iIzRmNjc0MCIgc3Ryb2tlLXdpZHRoPSIyMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0yNTYgMzY1QzI4OSAzMjIgMzM4IDMwNiA0MDcgMzI2VjE3MUMzNDUgMTUzIDI5NCAxNjcgMjU2IDIxMVYzNjVaIiBzdHJva2U9IiM0ZjY3NDAiIHN0cm9rZS13aWR0aD0iMjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNMjU2IDIxMVYzNzYiIHN0cm9rZT0iIzRmNjc0MCIgc3Ryb2tlLXdpZHRoPSIxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTI1NiAxMThWMjEwIiBzdHJva2U9IiM0ZjY3NDAiIHN0cm9rZS13aWR0aD0iMjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0yMjEgMTU5SDI5MSIgc3Ryb2tlPSIjNGY2NzQwIiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNMTUxIDEyM0wxNzkgMTU0IiBzdHJva2U9IiM0ZjY3NDAiIHN0cm9rZS13aWR0aD0iMTMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0zNjEgMTIzTDMzMyAxNTQiIHN0cm9rZT0iIzRmNjc0MCIgc3Ryb2tlLXdpZHRoPSIxMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTI1NiA3OFY5OCIgc3Ryb2tlPSIjNGY2NzQwIiBzdHJva2Utd2lkdGg9IjEzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNMTkxIDk1TDIwNyAxMjYiIHN0cm9rZT0iIzRmNjc0MCIgc3Ryb2tlLXdpZHRoPSIxMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTMyMSA5NUwzMDUgMTI2IiBzdHJva2U9IiM0ZjY3NDAiIHN0cm9rZS13aWR0aD0iMTMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=";

const shareThemes: {
  id: ShareTheme; label: string; bg: string; text: string; muted: string; accent: string; line: string;
}[] = [
  { id: "day",     label: "Día",       bg: "#e7eadf", text: "#26351f", muted: "#78716c", accent: "#4f6740", line: "rgba(79,103,64,0.2)" },
  { id: "night",   label: "Noche",     bg: "#202822", text: "#f4f1e8", muted: "#7a8a72", accent: "#c8d2bf", line: "rgba(200,210,191,0.2)" },
  { id: "sunrise", label: "Amanecer",  bg: "#efe5d6", text: "#3f2f22", muted: "#78716c", accent: "#8a5a32", line: "rgba(138,90,50,0.2)" },
  { id: "sunset",  label: "Atardecer", bg: "#e8ddd2", text: "#3b2a22", muted: "#78716c", accent: "#7a4f35", line: "rgba(122,79,53,0.2)" },
];

const FRAGMENT_MAX = 400;

function formatGospelDate(dateStr: string): string {
  try {
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const parts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/").reverse();
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  } catch { return dateStr; }
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

export default function ShareReflectionModal({
  text,
  gospelReference,
  gospelDate,
  authorUsername,
  sharerUsername,
  onClose,
}: ShareReflectionModalProps) {
  const appTheme = getThemeClasses();
  const { theme: dayPeriod } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const [selectedTheme, setSelectedTheme] = useState<ShareTheme>(dayPeriod);
  const [textMode, setTextMode] = useState<TextMode>("full");
  const [fragmentStart, setFragmentStart] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const formattedDate = formatGospelDate(gospelDate);
  const isOwnPost = authorUsername === sharerUsername;
  const fragmentText = text.slice(fragmentStart, fragmentStart + FRAGMENT_MAX);
  const maxStart = Math.max(0, text.length - FRAGMENT_MAX);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { logoRef.current = img; setLogoLoaded(true); };
    img.src = `data:image/svg+xml;base64,${LOGO_B64}`;
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !logoLoaded) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = shareThemes.find((s) => s.id === selectedTheme) ?? shareThemes[0];
    const pad = 90;
    const textX = pad;
    const textW = W - pad * 2;

    // Fondo
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);

    // ── HEADER ──
    const headerY = pad + 80;
    const logoSize = 72;

    if (logoRef.current) {
      ctx.save();
      roundRect(ctx, textX, headerY - logoSize * 0.75, logoSize, logoSize, 16);
      ctx.clip();
      ctx.drawImage(logoRef.current, textX, headerY - logoSize * 0.75, logoSize, logoSize);
      ctx.restore();
    }

    ctx.fillStyle = t.accent;
    ctx.font = "600 40px system-ui, -apple-system, sans-serif";
    ctx.fillText("PALABRADELDIA", textX + logoSize + 20, headerY - 20);

    ctx.fillStyle = t.muted;
    ctx.font = "400 34px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`@${sharerUsername}`, W - pad, headerY - 20);
    ctx.textAlign = "left";

    ctx.strokeStyle = t.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, headerY + 30);
    ctx.lineTo(W - pad, headerY + 30);
    ctx.stroke();

    // ── FOOTER — fijo siempre abajo ──
    const footerY = H - pad - 60;
    const footerLineY = footerY - 50;

    ctx.strokeStyle = t.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, footerLineY);
    ctx.lineTo(W - pad, footerLineY);
    ctx.stroke();

    ctx.fillStyle = t.accent;
    ctx.font = "600 36px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${gospelReference}  ·  ${formattedDate}`, textX, footerY - 10);

    if (!isOwnPost) {
      ctx.fillStyle = t.muted;
      ctx.font = "400 30px system-ui, -apple-system, sans-serif";
      ctx.fillText(`Escrita por @${authorUsername}`, textX, footerY + 36);
    }

    // ── COMILLA DECORATIVA ──
    ctx.fillStyle = t.accent + "18";
    ctx.font = "700 320px Georgia, serif";
    ctx.fillText("\u201C", textX - 20, headerY + 340);

    // ── TEXTO — limitado para no solapar el footer ──
    ctx.fillStyle = t.text;
    const textTopY = headerY + 200;
    const textMaxY = footerLineY - 60;
    const textMaxH = textMaxY - textTopY;

    let fontSize = 58;
    if (textMode === "shrink") fontSize = 44;

    ctx.font = `400 ${fontSize}px Georgia, serif`;
    const lineH = fontSize * 1.75;
    const maxLines = Math.floor(textMaxH / lineH);

    const displayText = textMode === "fragment"
      ? `\u201C${fragmentText}\u201D`
      : `\u201C${text}\u201D`;

    const words = displayText.split(" ");
    let line = "";
    let currentY = textTopY;
    let lineCount = 0;
    let drawn = false;

    for (const word of words) {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > textW && line !== "") {
        if (lineCount >= maxLines - 1) {
          ctx.fillText(line.trim().replace(/["\u201D]$/, "") + "\u2026\u201D", textX, currentY);
          drawn = true;
          break;
        }
        ctx.fillText(line.trim(), textX, currentY);
        line = word + " ";
        currentY += lineH;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    if (!drawn && line.trim()) {
      ctx.fillText(line.trim(), textX, currentY);
    }

  }, [selectedTheme, textMode, fragmentStart, logoLoaded, text, fragmentText,
      gospelReference, formattedDate, authorUsername, sharerUsername, isOwnPost]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsSharing(true);
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) { setIsSharing(false); return; }
        const file = new File([blob], "reflexion-palabradeldia.png", { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "PalabradelDía",
            text: `Reflexión del Evangelio del ${formattedDate}`,
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "reflexion-palabradeldia.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsSharing(false);
      }, "image/png");
    } catch { setIsSharing(false); }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <section
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border p-6 shadow-2xl ${appTheme.card}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className={`text-lg font-bold ${appTheme.primaryText}`}>Compartir reflexión</h2>
          <button onClick={onClose} className={`rounded-full px-3 py-1 text-sm font-bold ${appTheme.mutedButton}`}>✕</button>
        </div>

        <canvas ref={canvasRef} className="mb-5 w-full rounded-2xl border" style={{ aspectRatio: "9/16" }} />

        <div className="mb-5">
          <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${appTheme.accentText}`}>Texto</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "full" as TextMode,     label: "Completo" },
              { id: "shrink" as TextMode,   label: "Reducir" },
              { id: "fragment" as TextMode, label: "Fragmento" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTextMode(m.id)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  textMode === m.id ? appTheme.button : appTheme.mutedButton
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {textMode === "fragment" && (
            <div className="mt-4">
              <p className={`mb-2 text-xs ${appTheme.mutedText}`}>
                Desliza para elegir el fragmento ({FRAGMENT_MAX} caracteres)
              </p>
              <input
                type="range"
                min={0}
                max={maxStart}
                value={fragmentStart}
                step={1}
                onChange={(e) => setFragmentStart(Number(e.target.value))}
                className="w-full"
              />
              <p className={`mt-2 text-xs ${appTheme.mutedText}`}>
                "{fragmentText.slice(0, 60)}..."
              </p>
            </div>
          )}
        </div>

        <div className="mb-5">
          <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${appTheme.accentText}`}>Tema</p>
          <div className="grid grid-cols-2 gap-2">
            {shareThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTheme(t.id)}
                style={{ background: t.bg, color: t.text, borderColor: selectedTheme === t.id ? t.accent : t.line }}
                className="rounded-xl border-2 px-3 py-2 text-xs font-semibold transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

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
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AppTab = "evangelio" | "diario" | "comunidad";

type GuidedGuestTourProps = {
  isAuthenticated: boolean;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  theme: {
    mode?: string;
    primaryText: string;
    bodyText: string;
    mutedText: string;
    accentText: string;
    button: string;
    mutedButton: string;
    card: string;
  };
};

type TourStep = {
  id: string;
  tab: AppTab;
  selector: string;
  eyebrow: string;
  title: string;
  body: string;
  placement?: "top" | "bottom";
};


const TOUR_STEPS: TourStep[] = [
  {
    id: "evangelio",
    tab: "evangelio",
    selector: "[data-tour='gospel-section']",
    eyebrow: "Paso 1",
    title: "Todo empieza por la Palabra del día",
    body: "Cada día puedes leer el Evangelio y detenerte unos minutos ante él.",
    placement: "bottom",
  },
  {
    id: "reflection",
    tab: "evangelio",
    selector: "[data-tour='reflection-box']",
    eyebrow: "Paso 2",
    title: "Escribe tu reflexión personal",
    body: "Después de detenerte, escribe qué te inspira la Palabra. Compártelo en comunidad o guárdalo solo para ti.",
    placement: "top",
  },
  {
    id: "diary",
    tab: "diario",
    selector: "[data-tour='diary-section']",
    eyebrow: "Paso 3",
    title: "Abre tu diario",
    body: "Aquí se guardan tus reflexiones o las que más te han inspirado de la comunidad para releerlas, filtrarlas y ver tu camino espiritual.",
    placement: "bottom",
  },
  {
    id: "community",
    tab: "comunidad",
    selector: "[data-tour='community-section']",
    eyebrow: "Paso 4",
    title: "Descubre la comunidad",
    body: "Crea una cuenta y explora las reflexiones compartidas por otros usuarios y guarda las que te ayuden a acercarte a Dios.",
    placement: "bottom",
  },
  {
    id: "account",
    tab: "evangelio",
    selector: "[data-tour='user-area']",
    eyebrow: "Último paso",
    title: "Consérvalo todo y modifica tu perfil",
    body: "Con tu cuenta podrás abrir tu diario en otros dispositivos, compartir reflexiones, seguir usuarios y recibir sus notificaciones.",
    placement: "bottom",
  },
];

export default function GuidedGuestTour({
  isAuthenticated,
  activeTab,
  onTabChange,
  theme,
}: GuidedGuestTourProps) {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[stepIndex];

  const isLastStep = stepIndex === TOUR_STEPS.length - 1;

  const panelClasses =
    theme.mode === "night"
      ? "border-[#d9e2cf]/15 bg-[#151b17] text-[#edf3e8]"
      : "border-[#d8d1c0] bg-[#f8f4ea] text-[#26351f]";

  useEffect(() => {
  if (typeof window === "undefined") return;

  if (!isAuthenticated) {
    const timeout = window.setTimeout(() => {
      setStepIndex(0);
      setIsOpen(true);
      setIsReady(true);
    }, 600);

    return () => window.clearTimeout(timeout);
  }

  setIsOpen(false);
  setIsReady(true);
}, [isAuthenticated]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    if (activeTab !== currentStep.tab) {
      onTabChange(currentStep.tab);
    }
  }, [activeTab, currentStep, isOpen, onTabChange]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    let frame = 0;

    function updateTarget() {
      const element = document.querySelector(currentStep.selector);

      if (!element) {
        setTargetRect(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    frame = window.requestAnimationFrame(() => {
      window.setTimeout(updateTarget, 420);
    });

    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget, true);
    };
  }, [currentStep, isOpen, activeTab]);

  function completeTour() {
    setIsOpen(false);
  }

  function goNext() {
    if (isLastStep) {
      completeTour();
      return;
    }

    setStepIndex((current) => current + 1);
  }

  const spotlightStyle = useMemo(() => {
    if (!targetRect) return null;

    return {
      left: Math.max(targetRect.left - 8, 12),
      top: Math.max(targetRect.top - 8, 12),
      width: Math.min(targetRect.width + 16, window.innerWidth - 24),
      height: targetRect.height + 16,
    };
  }, [targetRect]);

  const panelStyle = useMemo(() => {
  if (typeof window === "undefined") {
    return {};
  }

  const isDesktop = window.innerWidth >= 640;

  if (isDesktop) {
    return {
      left: "auto",
      right: 32,
      top: "auto",
      bottom: 32,
    };
  }

  if (!targetRect) {
    return {
      left: 16,
      right: 16,
      top: 120,
    };
  }

  const prefersBottom = currentStep.placement !== "top";
  const rawTop = prefersBottom
    ? targetRect.bottom + 18
    : targetRect.top - 250;

  const top = Math.min(Math.max(rawTop, 96), window.innerHeight - 280);

  return {
    left: 16,
    right: 16,
    top,
  };
}, [currentStep.placement, targetRect]);

  if (!isReady || !isOpen || isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[600]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" />

        {spotlightStyle && (
          <motion.div
            layout
            className="pointer-events-none fixed rounded-[2rem] border-2 border-[#d9e2cf] shadow-[0_0_0_9999px_rgba(0,0,0,0.48)]"
            style={spotlightStyle}
            transition={{ duration: 0.28, ease: "easeOut" }}
          />
        )}

        <motion.article
          className={`fixed rounded-[2rem] border p-5 shadow-2xl sm:bottom-8 sm:left-auto sm:right-8 sm:top-auto sm:w-[25rem] ${panelClasses}`}
          style={panelStyle}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <p
            className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}
          >
            {currentStep.eyebrow}
          </p>

          <h3 className={`mt-3 text-xl font-bold ${theme.primaryText}`}>
            {currentStep.title}
          </h3>

          <p className={`mt-3 text-sm leading-6 ${theme.bodyText}`}>
            {currentStep.body}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={completeTour}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${theme.mutedButton}`}
            >
              Saltar
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${theme.mutedText}`}>
                {stepIndex + 1}/{TOUR_STEPS.length}
              </span>

              <button
                type="button"
                onClick={goNext}
                className={`rounded-full px-5 py-2 text-sm font-bold shadow-sm ${theme.button}`}
              >
                {isLastStep ? "Entendido" : "Siguiente"}
              </button>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}
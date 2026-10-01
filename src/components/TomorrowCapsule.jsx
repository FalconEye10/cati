import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCw, Feather } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

const loveNotes = [
  "Promit să fiu primul tău gând bun de dimineață. Chiar și când n-am dormit deloc.",
  "Data viitoare când ne vedem, timpul se oprește din nou doar pentru noi.",
  "Munții dintre noi sunt doar peisaj frumos pe drum spre tine.",
  "Ești cel mai frumos lucru neașteptat de la o olimpiadă. Chiar și de la una de germană.",
  "Te aleg în fiecare zi, dincolo de orice kilometru.",
  "Să adormim iar la telefon, ascultând respirația celuilalt.",
  "Mulțumesc că ai făcut dintr-o privire din Suceava un «Noi» mare cât casa."
];

/**
 * TomorrowCapsule
 * Capsula secretă „Un răvaș pentru ziua de mâine”.
 * Permite utilizatoarei să extragă o promisiune sau un gând cald dedicat zilei de mâine.
 */
export function TomorrowCapsule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawNote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playCardFlipSound();

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * loveNotes.length);
    } while (nextIndex === currentIndex && loveNotes.length > 1);

    setCurrentIndex(nextIndex);
    setIsOpen(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <section
      aria-label="Răvașe pentru ziua de mâine"
      className="relative mx-auto my-16 w-full max-w-xl px-4 text-center"
    >
      <div className="relative rounded-3xl border border-rose-200/80 bg-white/75 p-8 shadow-candle backdrop-blur-md sm:p-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-800 uppercase tracking-wider">
          <Feather className="h-4 w-4 text-rose-600" />
          Pentru fiecare zi
        </div>

        <h3 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
          Un răvaș pentru mâine
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
          Pentru serile în care suntem departe, trage un gând mic de la mine.
        </p>

        {/* Zona interactivă a răvașului */}
        <div className="my-8 min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.85, rotateX: 45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full rounded-2xl border border-dashed border-rose-300 bg-[#FFF9F6] p-7 shadow-inner"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-rose-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-widest shadow-xs">
                  Gândul de azi
                </div>

                <p className="font-serif text-xl italic leading-relaxed text-[#1C1215] sm:text-2xl">
                  „{loveNotes[currentIndex]}”
                </p>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-serif text-rose-800 font-semibold">
                  <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                  <span>Din toată inima</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2.5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
                <span className="text-sm text-ink-subtle">
                  Apasă pe butonul de mai jos pentru a desface primul răvaș
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buton acțiune */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={drawNote}
            disabled={isAnimating}
            className="group flex min-h-[50px] items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`h-4.5 w-4.5 transition-transform ${isAnimating ? 'animate-spin' : 'group-hover:rotate-45'}`} />
            <span>{isOpen ? "Mai trage unul 🎲" : "Deschide un răvaș"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default TomorrowCapsule;

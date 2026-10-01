import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCw, Heart } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

/**
 * TiltFlipCard
 * Card interactiv 3D cu două fețe:
 * - Față: Logo-ul oficial al Olimpiadei de Limba Germană Modernă (Suceava 2026),
 *         locația Hotel Continental și contextul primei priviri.
 * - Verso: Gândul secret al lui Ștefan din clipa când a zărit-o pe Cati.
 */
export function TiltFlipCard({
  frontTitle = "Privirea din lobby",
  frontSubtitle = "Hotel Continental • Suceava 2026",
  image = "/photos/olimpiada-suceava.jpg",
  frontNote = "Atinge cardul pentru a citi gândul secret",
  secretThought = "Când te-am văzut, ai stârnit o sclipire și ai dat o scânteie în ochii mei",
  author = "Ștefan",
  onCardFlipped
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    playCardFlipSound();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && onCardFlipped) {
      onCardFlipped();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div className="perspective-1000 mx-auto my-6 w-full max-w-md">
      <div
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Ascunde gândul secret și întoarce cardul" : "Întoarce cardul pentru a citi gândul secret"}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        className="group relative h-[470px] sm:h-[490px] w-full cursor-pointer focus-visible:outline-none select-none"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="transform-style-3d relative h-full w-full rounded-2xl shadow-candle transition-shadow duration-300 group-hover:shadow-soft-glow"
        >
          {/* ========================================================
              FAȚA CARDULUI: LOGO-UL OFICIAL AL OLIMPIADEI SUCEAVA 2026
             ======================================================== */}
          <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-gradient-to-br from-[#FFFDFB] via-rose-50/30 to-amber-50/20 p-6 text-left shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-3 py-0.5 text-xs font-medium text-rose-900 border border-rose-200/60">
                  <Sparkles className="h-3 w-3 text-rose-600" />
                  Olimpiada Națională • Suceava
                </span>
                <span className="text-xs font-mono text-ink-subtle">28 mar – 2 apr 2026</span>
              </div>

              {/* Logo / Afișul oficial al Olimpiadei de Germană Suceava */}
              <div className="relative my-4 flex h-60 sm:h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-stone-200/90 bg-white p-2 shadow-inner">
                <img
                  src={image}
                  alt="Afiș oficial Olimpiada Națională de Limba Germană Modernă 2026 Suceava"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute bottom-2 left-2 rounded-md bg-stone-900/80 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs shadow-xs">
                  Hotel Continental • Suceava
                </div>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-ink">
                {frontTitle}
              </h4>
              <p className="mt-1 text-xs font-medium tracking-wider text-rose-900/80 uppercase">
                {frontSubtitle}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-rose-100/90 pt-3 text-xs text-rose-700">
              <span className="inline-flex items-center gap-1.5 font-medium group-hover:underline">
                <RotateCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                {frontNote}
              </span>
              <span className="text-[11px] text-ink-subtle font-light">Apasă pentru flip</span>
            </div>
          </div>

          {/* ========================================================
              SPATELE CARDULUI: GÂNDUL SECRET AL LUI ȘTEFAN
             ======================================================== */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-rose-300/80 bg-gradient-to-br from-[#FFF9F6] via-rose-50/60 to-amber-50/40 p-7 text-left shadow-inner">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <span className="text-xs font-semibold tracking-wider text-rose-900 uppercase">
                Gândul secret din acea clipă
              </span>
              <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
            </div>

            <div className="my-auto py-4">
              <span className="text-[10px] font-mono tracking-widest text-rose-800/70 uppercase block mb-3">
                Lobby Continental • Suceava • 28 martie
              </span>
              <p className="font-serif text-2xl sm:text-3xl leading-relaxed font-normal text-ink italic">
                „{secretThought}”
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-rose-200/60 pt-3">
              <span className="font-serif text-sm font-medium italic text-rose-900">
                — {author}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-ink-subtle">
                <RotateCw className="h-3 w-3" />
                Apasă pentru revenire
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TiltFlipCard;

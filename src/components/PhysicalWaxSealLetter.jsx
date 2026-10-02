import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { LetterModal } from './LetterModal';
import { storyData } from '../data/story';
import { playWaxCrackSound } from '../utils/soundEffects';

/**
 * PhysicalWaxSealLetter
 * Plic fizic de colecție cu sigiliu de ceară roșie topită manual,
 * panglică de satin și monogramă gravată „C & Ș”.
 * La acționare: fisură organică, desfacerea panglicii, deschiderea clapei
 * și lansare discretă de confetti rose-gold.
 */
export function PhysicalWaxSealLetter({ isVisible }) {
  const [sealState, setSealState] = useState('sealed'); 
  // 'sealed' | 'cracking' | 'broken' | 'opened'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { letter } = storyData;

  const handleSealClick = () => {
    if (sealState !== 'sealed') return;

    playWaxCrackSound();

    // Pasul 1: Fisură (250ms)
    setSealState('cracking');

    setTimeout(() => {
      // Pasul 2: Rupere sigiliu și clapetă (500ms)
      setSealState('broken');

      setTimeout(() => {
        // Pasul 3: Foaia urcă din interior (600ms)
        setSealState('opened');

        // Confetti discret, o singură dată (~35 particule)
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
          try {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.65 },
              colors: ['#BE123C', '#F43F5E', '#FECDD3', '#FEF3C7', '#E5A9A9'],
              disableForReducedMotion: true,
              ticks: 200
            });
          } catch {
            // Fail safe
          }
        }

        // Deschidere modal
        setTimeout(() => {
          setIsModalOpen(true);
        }, 550);
      }, 550);
    }, 350);
  };

  if (!isVisible) return null;

  return (
    <section
      id="final-letter-section"
      aria-label="Scrisoarea sigilată"
      className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-20 text-center scroll-mt-24"
    >
      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
        {/* Antet discret cu îndemn romantic clar */}
        <div className="mb-8 flex flex-col items-center">
          <span className="text-xs font-semibold tracking-[0.25em] text-rose-900/80 uppercase">
            {letter.recipientTag}
          </span>
          <h3 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-4xl md:text-5xl">
            O scrisoare pentru tine
          </h3>
          <p className="mt-3 text-sm sm:text-base font-serif italic text-rose-900/90 font-medium max-w-md leading-relaxed">
            {letter.waxPrompt}
          </p>
        </div>

        {/* CONTAINERUL PLICULUI FIZIC CU CLAPE ȘI PANGLICĂ */}
        <div className="relative h-64 w-full max-w-md sm:h-72 perspective-1000">
          
          {/* Spatele plicului din hârtie bumbac grea */}
          <div className="absolute inset-0 rounded-2xl border border-[#D5C2B4] bg-gradient-to-b from-[#FAF4EF] to-[#EFE2D8] shadow-[0_20px_45px_-10px_rgba(28,18,21,0.18)]" />

          {/* Foaia de scrisoare din interior care urcă la deschidere */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={
              sealState === 'opened'
                ? { y: -90, opacity: 1, scale: 1.02 }
                : { y: 0, opacity: 0 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-6 top-4 bottom-6 rounded-t-xl border border-rose-200/90 bg-[#FFFDFB] p-5 shadow-sm"
          >
            <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="h-1.5 w-24 rounded-full bg-rose-200" />
              <div className="h-1.5 w-44 rounded-full bg-rose-100" />
              <div className="h-1.5 w-36 rounded-full bg-rose-100" />
              <div className="h-1.5 w-28 rounded-full bg-rose-100" />
            </div>
          </motion.div>

          {/* Panglica verticală de satin din spatele sigiliului */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 shadow-xs z-10 opacity-90">
            <div className="absolute inset-y-0 left-1 w-[1px] bg-rose-400/40" />
            <div className="absolute inset-y-0 right-1 w-[1px] bg-rose-950/40" />
          </div>

          {/* Clapele triunghiulare laterale ale plicului */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-10">
            {/* Clapa stângă */}
            <div className="absolute top-0 bottom-0 left-0 w-1/2 border-r border-[#D9C7BA] bg-gradient-to-tr from-[#EAD8CC] to-[#F7ECE4] [clip-path:polygon(0_0,0_100%,100%_100%)] shadow-xs" />
            {/* Clapa dreaptă */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 border-l border-[#D9C7BA] bg-gradient-to-tl from-[#EAD8CC] to-[#F7ECE4] [clip-path:polygon(100%_0,100%_100%,0_100%)] shadow-xs" />
            {/* Clapa inferioară */}
            <div className="absolute right-0 bottom-0 left-0 h-1/2 border-t border-[#D9C7BA] bg-gradient-to-t from-[#E2CEBF] to-[#F4E6DC] [clip-path:polygon(0_100%,50%_0,100%_100%)] shadow-sm" />
          </div>

          {/* Clapa superioară a plicului (Flip up) */}
          <motion.div
            animate={
              sealState === 'broken' || sealState === 'opened'
                ? { rotateX: 180, zIndex: 5 }
                : { rotateX: 0, zIndex: 25 }
            }
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-0 right-0 left-0 h-1/2 bg-gradient-to-b from-[#E0CCC0] to-[#EFE3DB] border-b border-[#C8B3A4] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md pointer-events-none"
          />

          {/* SIGILIUL DE CEARĂ ROȘIE CU EFECT DE TOPITURĂ & CRĂPĂTURĂ */}
          <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={handleSealClick}
              aria-label="Apasă pe sigiliul de ceară pentru a deschide scrisoarea"
              disabled={sealState !== 'sealed'}
              className={`group relative flex h-26 w-26 items-center justify-center rounded-full transition-transform duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/50 ${
                sealState === 'sealed'
                  ? 'cursor-pointer hover:scale-108 active:scale-95'
                  : 'cursor-default'
              }`}
            >
              {/* Picături organice de ceară topită pe margini */}
              <div className="pointer-events-none absolute -inset-2 rounded-full bg-radial from-rose-900/60 to-transparent blur-xs" />
              <div className="pointer-events-none absolute -bottom-1 -left-1 h-5 w-5 rounded-full bg-[#881337] shadow-sm" />
              <div className="pointer-events-none absolute -top-1 -right-0.5 h-4 w-4 rounded-full bg-[#881337] shadow-sm" />

              {/* Corpul sigiliului din ceară roșie carmin cu reflexie lucioasă */}
              <motion.div
                animate={
                  sealState === 'sealed'
                    ? {
                        scale: [1, 1.03, 1],
                        boxShadow: [
                          '0 10px 30px rgba(159, 18, 57, 0.55), inset 0 2px 5px rgba(255, 255, 255, 0.45)',
                          '0 14px 38px rgba(190, 18, 60, 0.7), inset 0 2px 5px rgba(255, 255, 255, 0.55)',
                          '0 10px 30px rgba(159, 18, 57, 0.55), inset 0 2px 5px rgba(255, 255, 255, 0.45)'
                        ]
                      }
                    : sealState === 'cracking'
                    ? { rotate: [-3, 3, -2, 0], scale: 1.08 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{
                  duration: sealState === 'sealed' ? 3.5 : 0.35,
                  repeat: sealState === 'sealed' ? Infinity : 0
                }}
                className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-[#680b20] bg-gradient-to-br from-[#be123c] via-[#881337] to-[#3a0410] text-amber-100 shadow-[0_12px_32px_rgba(159,18,57,0.55),inset_0_3px_6px_rgba(255,255,255,0.45)]"
              >
                {/* Ștampila gravată cu inițialele C & Ș și inel de aur */}
                <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-dashed border-amber-300/60 bg-gradient-to-br from-rose-950/70 to-rose-900/50 shadow-inner">
                  <span className="font-serif text-2xl font-bold tracking-wider text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {letter.sealInitials}
                  </span>
                </div>

                {/* Crăpături vizibile la fisurare */}
                {sealState === 'cracking' && (
                  <>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="absolute inset-0 m-auto h-20 w-1 bg-black/85 shadow-md"
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 m-auto w-20 h-1 bg-black/85 shadow-md"
                    />
                  </>
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Buton de recitire dacă a fost deja deschis */}
        {sealState === 'opened' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex min-h-[48px] items-center gap-2 rounded-full border border-rose-300 bg-white/90 px-7 py-2.5 text-sm font-medium text-rose-950 shadow-sm hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
            >
              <span>Recitește scrisoarea</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Modalul Scrisorii complet montat prin portal */}
      <LetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        letterData={letter}
      />
    </section>
  );
}

export default PhysicalWaxSealLetter;

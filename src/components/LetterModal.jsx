import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useEscapeKey } from '../hooks/useEscapeKey';

/**
 * LetterModal
 * Scrisoare de dragoste intimă în stil archival / scrisoare de epocă pe hârtie bumbac:
 * Include drop cap decorativ, filigran discret, margini fine de hârtie manuală,
 * textură tactilă și închidere comodă (Escape, backdrop, X).
 */
export function LetterModal({ isOpen, onClose, letterData }) {
  const closeButtonRef = useRef(null);

  useLockBodyScroll(isOpen);
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop cu atmosferă nocturnă caldă */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Foaia de scrisoare pe hârtie texturată de bumbac cu colțuri filigranate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border-2 border-[#E2D2C2] bg-gradient-to-b from-[#FFFDF9] via-[#FAF4ED] to-[#F5ECE2] shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.8)_inset]"
          >
            {/* Colțuri decorative fine din foiță de aur (Filigree vintage) */}
            <div className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-amber-600/40 rounded-tl-sm z-30" />
            <div className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-amber-600/40 rounded-tr-sm z-30" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-600/40 rounded-bl-sm z-30" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-600/40 rounded-br-sm z-30" />

            {/* Header scrisoare cu filigran și buton de închidere */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-rose-900/10 bg-[#FFFDF9]/95 px-6 py-4.5 backdrop-blur-md sm:px-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-800 to-rose-950 text-amber-100 font-serif text-xs font-bold shadow-xs border border-amber-300/30">
                  {letterData?.sealInitials || "C & Ș"}
                </div>
                <div>
                  <span id="letter-modal-title" className="block font-serif text-base font-semibold tracking-wide text-rose-950">
                    {letterData?.recipientTag || "Pentru Cati"}
                  </span>
                  <span className="block text-[11px] text-ink-subtle uppercase tracking-widest font-mono">
                    {letterData?.date || "2 octombrie 2026"}
                  </span>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Închide scrisoarea"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-rose-100/70 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corpul scrisorii cu scroll interior fin și text aliniat natural la stânga */}
            <div className="overflow-y-auto px-6 py-8 sm:px-12 sm:py-12 text-left">
              <div className="space-y-7 font-serif text-xl leading-relaxed text-[#1C1215] sm:text-[1.38rem] sm:leading-[2.05]">
                {letterData?.content?.map((paragraph, index) => {
                  const isGreeting = index === 0;
                  const isFirstParagraph = index === 1;
                  const isClosing = index === letterData.content.length - 2;
                  const isSignature = index === letterData.content.length - 1;

                  if (isGreeting) {
                    return (
                      <p
                        key={index}
                        className="text-left font-serif text-3xl font-medium tracking-tight text-rose-950 sm:text-5xl border-b border-rose-200/50 pb-4 mb-2"
                      >
                        {paragraph}
                      </p>
                    );
                  }

                  if (isFirstParagraph) {
                    // Drop cap decorativ pe prima literă
                    const firstLetter = paragraph.charAt(0);
                    const restText = paragraph.slice(1);

                    return (
                      <p key={index} className="text-left text-[#22171B]">
                        <span className="float-left mr-3 mt-1 font-serif text-5xl font-normal leading-none text-rose-900 sm:text-6xl">
                          {firstLetter}
                        </span>
                        {restText}
                      </p>
                    );
                  }

                  if (isClosing) {
                    return (
                      <p
                        key={index}
                        className="pt-6 text-left font-serif italic text-rose-900 text-xl sm:text-2xl leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    );
                  }

                  if (isSignature) {
                    return (
                      <div key={index} className="pt-4 text-right">
                        <p className="font-serif text-2xl font-bold tracking-wide text-rose-950 sm:text-3xl inline-block border-b-2 border-rose-300/60 pb-1">
                          {paragraph}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="text-left text-[#22171B]">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Sigiliu & Ștampilă de sfârșit */}
              <div className="mt-14 flex flex-col items-center justify-center border-t border-rose-900/10 pt-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-900/30 bg-rose-50 font-serif text-sm font-bold text-rose-900 shadow-inner">
                  {letterData?.sealInitials || "C & Ș"}
                </div>
                <span className="mt-2 text-xs tracking-[0.25em] uppercase text-rose-900/70 font-semibold">
                  Păstrat pentru totdeauna în inimă
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default LetterModal;

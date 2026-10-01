import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Heart, Clock, Award, Smartphone } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

/**
 * FaceTimeMemory
 * Card nocturn autentic bazat pe capturi reale de ecran din apelurile lor FaceTime.
 * Ștefan este deja prezent în poza originală (în fereastra Picture-in-Picture nativă a iPhone-ului).
 * Evidențiază cele două apeluri esențiale din septembrie 2026:
 * 1. 19 Septembrie 2026 (01:53:00) — Special ca relație: apelul în care au devenit oficial iubit și iubită
 * 2. 13 Septembrie 2026 (05:19:00) — Special ca timp: recordul all-time de 5 ore și 19 minute
 */
export function FaceTimeMemory({ memory }) {
  const calls = memory?.calls || [
    {
      id: "record",
      date: "13 Septembrie 2026",
      duration: "05:19:00",
      durationHuman: "5 ore și 19 minute • record all-time 🏆",
      image: "/photos/facetime-real-2.jpg",
      category: "Record all-time 🏆",
      title: "Recordul nostru",
      highlight: "Somnul a pierdut, noi am câștigat",
      description: "Am râs, am povestit, am adormit cu căștile în urechi. Somnul a pierdut, noi am câștigat."
    },
    {
      id: "relationship",
      date: "19 Septembrie 2026",
      duration: "01:53:00",
      durationHuman: "1 oră și 53 de minute",
      image: "/photos/facetime-real-1.jpg",
      category: "Apelul oficial 🥹",
      title: "Apelul în care am devenit oficial 🥹",
      highlight: "Momentul când am devenit iubit și iubită",
      description: "În 1h53 ne-am spus ce simțeam și am devenit iubit și iubită. Cel mai bine folosit timp."
    }
  ];

  const [activeCallId, setActiveCallId] = useState(calls[0]?.id || "record");

  const currentCall = calls.find((c) => c.id === activeCallId) || calls[0];

  const handleSelectCall = (id) => {
    if (id !== activeCallId) {
      playCardFlipSound();
      setActiveCallId(id);
    }
  };

  return (
    <div className="relative mx-auto my-6 w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-stone-800/90 bg-gradient-to-b from-[#18131E] via-[#120E17] to-[#0A070E] p-6 text-stone-100 shadow-[0_25px_60px_rgba(0,0,0,0.7)] sm:p-8">
      {/* Lumini nocturne ambientale pe fundal */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-rose-900/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-950/40 blur-3xl" />

      {/* Stele nocturne subtile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-12 h-1 w-1 rounded-full bg-amber-200/80 shadow-[0_0_4px_#fde68a]"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-16 right-20 h-1 w-1 rounded-full bg-rose-200/80 shadow-[0_0_4px_#fecdd3]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-24 left-24 h-1 w-1 rounded-full bg-amber-100/70"
        />
      </div>

      {/* Header card cu etichetă de amintire */}
      <div className="flex items-center justify-between border-b border-stone-800/70 pb-3.5">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-amber-200" />
          <span className="text-xs font-medium tracking-wide text-stone-400">
            {memory?.tag || "Nopțile noastre la FaceTime"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-950/60 px-2.5 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-800/40">
          <Sparkles className="h-2.5 w-2.5 text-rose-400" />
          Captură reală FaceTime
        </span>
      </div>

      {/* SELECTOR INTERACTIV ÎNTRE CELE 2 APELURI LEGENDĂ */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 rounded-2xl bg-stone-900/90 p-2 border border-stone-800/80">
        <button
          type="button"
          onClick={() => handleSelectCall("record")}
          className={`flex flex-col items-center justify-center rounded-xl py-3 px-2.5 transition-all cursor-pointer ${
            activeCallId === "record"
              ? "bg-gradient-to-r from-amber-900/90 to-amber-950 text-white shadow-md border border-amber-500/40"
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
          }`}
        >
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Award className={`h-4 w-4 ${activeCallId === "record" ? "text-amber-400" : "text-stone-400"}`} />
            <span>13 Septembrie</span>
          </div>
          <span className="mt-1 font-mono text-xs font-light text-amber-200">
            5h 19m • Record
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCall("relationship")}
          className={`flex flex-col items-center justify-center rounded-xl py-3 px-2.5 transition-all cursor-pointer ${
            activeCallId === "relationship"
              ? "bg-gradient-to-r from-rose-900/90 to-rose-950 text-white shadow-md border border-rose-500/40"
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
          }`}
        >
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Heart className={`h-4 w-4 ${activeCallId === "relationship" ? "fill-rose-400 text-rose-400" : "text-stone-400"}`} />
            <span>19 Septembrie</span>
          </div>
          <span className="mt-1 font-mono text-xs font-light text-rose-200">
            1h 53m • Oficial «Noi»
          </span>
        </button>
      </div>

      {/* ========================================================
          CADRUL AUTENTIC FACETIME CU SCREENSHOT-UL REAL (FĂRĂ PIP ARTIFICIAL)
         ======================================================== */}
      <div className="relative my-7 flex justify-center">
        {/* Ramă iPhone cu reflexie discretă */}
        <div className="relative max-w-[290px] sm:max-w-[325px] w-full overflow-hidden rounded-[2.8rem] border-[5px] border-stone-800 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCall.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative w-full aspect-[9/18.5] bg-black overflow-hidden flex items-center justify-center"
            >
              <img
                src={currentCall.image || "/photos/facetime-real-1.jpg"}
                alt={`Captură FaceTime reală din ${currentCall.date}`}
                className="w-full h-full object-cover object-center select-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Linie home indicator iOS în partea de jos */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 rounded-full bg-white/40 pointer-events-none" />
        </div>
      </div>

      {/* DETALIILE APELULUI SELECTAT (ANIMAȚIE LA SCHIMBARE) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCall.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          {/* Badge categorie */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide border shadow-xs mb-3"
            style={{
              backgroundColor: currentCall.id === "relationship" ? "rgba(190, 18, 60, 0.2)" : "rgba(217, 119, 6, 0.2)",
              borderColor: currentCall.id === "relationship" ? "rgba(244, 63, 94, 0.4)" : "rgba(245, 158, 11, 0.4)",
              color: currentCall.id === "relationship" ? "#FECDD3" : "#FDE68A"
            }}
          >
            {currentCall.id === "relationship" ? (
              <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
            ) : (
              <Clock className="h-4 w-4 text-amber-400" />
            )}
            <span>{currentCall.category}</span>
          </div>

          {/* Titlu amintire */}
          <h5 className="font-serif text-2xl font-medium tracking-wide text-stone-100 sm:text-3xl">
            {currentCall.title}
          </h5>

          {/* Cronometru FaceTime */}
          <div className="mt-4 inline-flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/90 px-8 py-3.5 shadow-inner">
            <span className="font-mono text-3xl sm:text-4xl font-light tracking-widest text-rose-300">
              {currentCall.id === 'record' ? '05:19:00' : '01:53:00'}
            </span>
            <span className="mt-1 font-serif text-sm font-medium text-rose-200/90">
              {currentCall.duration}
            </span>
          </div>

          {/* Descriere emoțională */}
          <div className="mt-5 rounded-2xl border border-stone-800/80 bg-stone-900/50 p-5 text-left">
            <p className="font-serif italic text-base sm:text-lg leading-relaxed text-stone-200">
              „{currentCall.description}”
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* COMPARAȚIE VIZUALĂ: TIMP vs. RELAȚIE */}
      <div className="mt-7 rounded-2xl border border-stone-800/90 bg-stone-950/70 p-4 text-center">
        <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
          Două nopți de neuitat din septembrie 2026
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div
            onClick={() => handleSelectCall("record")}
            className={`cursor-pointer rounded-xl p-3 border transition-all ${
              activeCallId === "record"
                ? "border-amber-500/50 bg-amber-950/40"
                : "border-stone-800/60 hover:bg-stone-900/50"
            }`}
          >
            <div className="font-semibold text-amber-300 text-sm sm:text-base">13 Septembrie</div>
            <div className="font-mono text-xs sm:text-sm text-stone-200 font-medium">5h 19m</div>
            <div className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Record all-time de timp ⏱️</div>
          </div>

          <div
            onClick={() => handleSelectCall("relationship")}
            className={`cursor-pointer rounded-xl p-3 border transition-all ${
              activeCallId === "relationship"
                ? "border-rose-500/50 bg-rose-950/40"
                : "border-stone-800/60 hover:bg-stone-900/50"
            }`}
          >
            <div className="font-semibold text-rose-300 text-sm sm:text-base">19 Septembrie</div>
            <div className="font-mono text-xs sm:text-sm text-stone-200 font-medium">1h 53m</div>
            <div className="text-[11px] sm:text-xs text-stone-400 mt-0.5">Special ca relație (Noi) ❤️</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceTimeMemory;

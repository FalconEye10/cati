import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Heart, Sparkles, Clock } from 'lucide-react';
import { TiltFlipCard } from './TiltFlipCard';
import { DistanceBridgeSection } from './DistanceBridgeSection';
import { FaceTimeMemory } from './FaceTimeMemory';

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 28
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

/**
 * StoryChapter
 * Randează capitolele din poveste cu animații cinematografice fizice:
 * - Suceava: amintirea din lobby cu card 3D tactil
 * - Puntea peste Carpați: hartă topografică și legătură de inimă
 * - Revederea: ceas analog cu ace mecanice (01:00 -> 05:00) și fereastră cu zori de zi
 * - Oficial «Noi»: contopirea literelor în cuvântul «noi»
 */
export function StoryChapter({
  chapter,
  isUnlocked,
  isCompleted,
  onChapterComplete,
  onScrollToNext
}) {
  const chapterRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ['start end', 'end start']
  });

  const parallaxBgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const parallaxFloral = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const [hasFlippedCard, setHasFlippedCard] = useState(false);

  // Stare Ceas Analog & Zori de zi (Capitolul 3: 03:00 -> 09:00)
  const [clockDegrees, setClockDegrees] = useState({ hour: 90, minute: 0 }); // 03:00 inițial
  const [skyPhase, setSkyPhase] = useState(0); // 0: noapte adâncă (03:00-04:00), 1: crepuscul (05:00-06:00), 2: zori aurii (07:00-09:00)
  const [currentHourDisplay, setCurrentHourDisplay] = useState(3);
  const [hasFinishedClock, setHasFinishedClock] = useState(false);

  // Stare Unire litere (Capitolul 4)
  const [mergedWords, setMergedWords] = useState(false);

  // Animația ceasului analogic mecanic (03:00 -> 09:00)
  useEffect(() => {
    if (chapter.id === 'reunion' && isUnlocked) {
      setClockDegrees({ hour: 90, minute: 0 });
      setSkyPhase(0);
      setCurrentHourDisplay(3);
      setHasFinishedClock(false);

      let h = 3;
      const interval = setInterval(() => {
        h += 1;
        if (h <= 9) {
          setCurrentHourDisplay(h);
          setClockDegrees({
            hour: h * 30,
            minute: (h - 3) * 360
          });

          if (h >= 5 && h < 7) setSkyPhase(1);
          if (h >= 7) setSkyPhase(2);

          if (h === 9) {
            clearInterval(interval);
            setTimeout(() => {
              setHasFinishedClock(true);
            }, 600);
          }
        }
      }, 650);

      return () => clearInterval(interval);
    }
  }, [chapter.id, isUnlocked]);

  // Contopirea cuvintelor în Capitolul 4
  useEffect(() => {
    if (chapter.id === 'official-us' && isUnlocked) {
      const timer = setTimeout(() => {
        setMergedWords(true);
        if (onChapterComplete) {
          onChapterComplete(chapter.stageIndex);
        }
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [chapter.id, isUnlocked, chapter.stageIndex, onChapterComplete]);

  if (!isUnlocked) return null;

  return (
    <motion.article
      ref={chapterRef}
      id={`chapter-${chapter.stageIndex}`}
      aria-label={`Capitolul ${chapter.number}: ${chapter.title}`}
      variants={revealVariants}
      initial="hidden"
      animate="visible"
      className="relative mx-auto my-14 w-full max-w-3xl px-4 py-8 sm:px-6"
    >
      {/* Element de fundal cu efect de paralaxă la scroll (Cifra romană a capitolului) */}
      <motion.div
        style={{ y: parallaxBgY }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-4 select-none font-serif text-8xl font-black text-rose-900/[0.04] sm:text-9xl sm:right-8"
      >
        {chapter.number}
      </motion.div>

      {/* ========================================================
          CAPITOLUL 1: SUCEAVA - PRIVIREA DIN LOBBY
         ======================================================== */}
      {chapter.id === 'suceava' && (
        <div className="flex flex-col items-center text-center">
          {/* Badge & Locație */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1 text-xs sm:text-sm font-semibold text-rose-800 uppercase tracking-wider">
            <span>{chapter.badge}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-semibold tracking-wider text-rose-900/80">
            <span>{chapter.location}</span>
            {chapter.event && (
              <span className="text-[11px] sm:text-xs font-normal text-ink-subtle">
                {chapter.event}
              </span>
            )}
          </div>

          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-6xl md:text-7xl">
            {chapter.title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl md:text-2xl font-light">
            {chapter.story}
          </p>

          {/* Cardul de amintire 3D Flip */}
          <div className="mt-9 w-full">
            <TiltFlipCard
              frontTitle={chapter.card.frontTitle}
              frontSubtitle={chapter.card.frontSubtitle}
              image={chapter.card.image || "/photos/olimpiada-suceava.jpg"}
              frontNote={chapter.card.frontNote}
              secretThought={chapter.card.secretThought}
              author={chapter.card.author}
              onCardFlipped={() => {
                setHasFlippedCard(true);
                onChapterComplete(chapter.stageIndex);
              }}
            />
          </div>

          {/* Îndemn romantic clar înainte de întoarcerea cardului */}
          {!hasFlippedCard && !isCompleted && (
            <div className="mt-6 flex flex-col items-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50/90 border border-rose-200/90 px-4 py-2 text-xs sm:text-sm font-medium text-rose-900 shadow-xs">
                <Heart className="h-4 w-4 fill-rose-600 text-rose-600 animate-pulse" />
                <span>{chapter.preFlipPrompt || "Întoarce poza, are ceva scris pe spate 👀"}</span>
              </div>
            </div>
          )}

          {/* Butonul de avansare cu îndemn romantic clar */}
          <AnimatePresence>
            {(hasFlippedCard || isCompleted) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic text-rose-900/90 font-medium max-w-md text-center">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    {chapter.postUnlockPrompt || "Hai mai departe, că au urmat mulți kilometri între noi."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onScrollToNext}
                  className="group flex min-h-[56px] items-center gap-3 rounded-full bg-gradient-to-r from-rose-800 to-rose-950 px-9 py-4 text-base sm:text-lg font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
                >
                  <span>{chapter.nextButtonText || "Hai mai departe ➜"}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================
          CAPITOLUL 2: PUNTEA DINTRE NOI (DISTANCE BRIDGE)
         ======================================================== */}
      {chapter.id === 'distance-bridge' && (
        <DistanceBridgeSection
          chapterData={chapter}
          isCompleted={isCompleted}
          onUnlockNextStage={() => {
            onChapterComplete(chapter.stageIndex);
            onScrollToNext();
          }}
        />
      )}

      {/* ========================================================
          CAPITOLUL 3: REVEDEREA (CEAS ANALOGIC & ZORI DE ZI)
         ======================================================== */}
      {chapter.id === 'reunion' && (
        <div className="flex flex-col items-center text-center">
          {/* Badge & Perioadă */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1 text-xs sm:text-sm font-semibold text-rose-800 uppercase tracking-wider">
            <span>{chapter.badge}</span>
          </div>

          <div className="text-xs sm:text-sm font-medium text-rose-900/80">
            <span>{chapter.period}</span>
          </div>

          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-6xl md:text-7xl">
            {chapter.title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg font-light">
            {chapter.story}
          </p>

          {/* CARD CU FEREASTRĂ CINEMATICĂ & CEAS MECANIC */}
          <div
            className={`relative my-10 w-full max-w-2xl overflow-hidden rounded-[2.5rem] border p-8 sm:p-12 transition-all duration-1000 ${
              skyPhase === 2
                ? 'border-amber-200/90 bg-gradient-to-b from-[#FFFDF9] via-amber-50/50 to-rose-50/40 text-ink shadow-[0_20px_50px_rgba(251,113,133,0.15)]'
                : skyPhase === 1
                ? 'border-purple-900/40 bg-gradient-to-b from-[#161224] via-[#2A182E] to-[#120F1D] text-rose-100 shadow-2xl'
                : 'border-stone-900 bg-gradient-to-b from-[#0B0910] via-[#120E1A] to-[#08070C] text-stone-200 shadow-2xl'
            }`}
          >
            {/* Răsărit de soare animat în fundal */}
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
                skyPhase === 2 ? 'opacity-80' : skyPhase === 1 ? 'opacity-40' : 'opacity-10'
              }`}
            >
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-64 w-[500px] rounded-full bg-gradient-to-t from-amber-300/40 via-rose-400/20 to-transparent blur-3xl" />
            </div>

            {/* Cronologia celor 3 momente: 1, 3, 4 septembrie */}
            <div className="space-y-4 mb-10">
              {chapter.dates.map((item, idx) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.35, duration: 0.6 }}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl px-6 py-4 ${
                    skyPhase === 2
                      ? 'border border-rose-100/90 bg-white/70 shadow-xs'
                      : 'border border-stone-800/80 bg-stone-900/50'
                  }`}
                >
                  <span className="font-serif text-xl font-medium text-rose-700 sm:text-2xl">
                    {item.day}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-normal ${
                      skyPhase === 2 ? 'text-ink-muted' : 'text-stone-300'
                    }`}
                  >
                    {item.note}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CEASUL ANALOG MECANIC CU ACE MOBILE */}
            <div className="flex flex-col items-center justify-center my-6">
              <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-rose-600 mb-4">
                {chapter.clockTitle || "4 septembrie • 03:00 → 09:00"}
              </span>

              {/* Cadranul rotund al ceasului */}
              <div className="relative flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full border-2 border-rose-300/60 bg-gradient-to-b from-white/90 to-amber-50/50 shadow-inner">
                {/* Marcaje orare */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{ transform: `rotate(${i * 30}deg) translateY(-68px)` }}
                    className="absolute h-2.5 w-0.5 bg-rose-900/40"
                  />
                ))}

                {/* Acul orar (gros, mai scurt) */}
                <motion.div
                  style={{
                    transformOrigin: 'bottom center',
                    rotate: `${clockDegrees.hour}deg`
                  }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute bottom-1/2 left-1/2 -translate-x-1/2 h-12 w-2 rounded-full bg-rose-900 shadow-xs z-10"
                />

                {/* Acul minutar (lung, mai subțire) */}
                <motion.div
                  style={{
                    transformOrigin: 'bottom center',
                    rotate: `${clockDegrees.minute}deg`
                  }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute bottom-1/2 left-1/2 -translate-x-1/2 h-16 w-1 rounded-full bg-amber-700 shadow-xs z-20"
                />

                {/* Punctul central */}
                <div className="h-3.5 w-3.5 rounded-full bg-rose-950 z-30 shadow-xs" />
              </div>

              {/* Ora afișată stilizat */}
              <div className="mt-4 font-mono text-4xl sm:text-5xl font-light tracking-widest text-rose-700">
                0{currentHourDisplay}:00
              </div>
              <span className="mt-2 text-sm sm:text-base opacity-90 font-serif italic text-rose-950 max-w-md text-center">
                {chapter.clockStates?.[currentHourDisplay] || (
                  currentHourDisplay === 9
                    ? "Ora 9: a trebuit să plec, dar a fost cea mai tare dimineață."
                    : currentHourDisplay >= 7
                    ? "Ora 7: a venit dimineața și noi tot împreună eram."
                    : currentHourDisplay >= 5
                    ? "Ora 5: se lumina afară la Oradea și nici nu ne păsa de somn."
                    : "Ora 3: normal lumea dormea. Noi povesteam și râdeam."
                )}
              </span>
            </div>

            {/* Notă romantică în timpul parcurgerii orelor */}
            {!hasFinishedClock && !isCompleted && (
              <div className="mt-4 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50/90 border border-amber-200/80 px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-950 shadow-xs">
                  <Clock className="h-4 w-4 text-amber-700 animate-spin" />
                  <span>{chapter.clockProgressMessage || "Orele trec spre 09:00… stai să vezi poza de dimineață 👀"}</span>
                </div>
              </div>
            )}

            {/* Text intim sincer & Fotografia din dimineața de 4 septembrie la Oradea */}
            <AnimatePresence>
              {hasFinishedClock && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mt-8 overflow-hidden rounded-2xl border border-rose-200/90 bg-[#FFFDF9]/95 p-7 text-center text-ink shadow-md"
                >
                  {/* Badge de evidențiere a orei 09:00 */}
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-100/90 border border-rose-300 px-4 py-1.5 text-xs sm:text-sm font-semibold text-rose-950 shadow-xs">
                    <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                    <span>{chapter.cardFinalBadge || "Ora 09:00 • Dimineața de 4 septembrie"}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-serif italic text-rose-900/90 max-w-md mx-auto mb-5 font-medium leading-relaxed">
                    {chapter.cardFinalSubtitle || "Momentul în care ne-am dat amintirile 🫶"}
                  </p>

                  {/* Fotografia autentică din dimineața de la Oradea */}
                  <div className="relative mx-auto mb-6 max-w-sm overflow-hidden rounded-xl border border-rose-200/80 shadow-inner bg-stone-900">
                    <img
                      src="/photos/dimineata-oradea.jpg"
                      alt={chapter.photoLabel || "4 septembrie • Oradea"}
                      className="h-60 sm:h-72 w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2.5 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                      {chapter.photoLabel || "4 septembrie • Oradea"}
                    </span>
                  </div>

                  <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed text-[#1C1215]">
                    „{chapter.intimateQuote}”
                  </p>
                  <span className="mt-3.5 block text-sm sm:text-base font-serif text-rose-900 font-medium">
                    {chapter.signature || "— 4 septembrie 2026, ora 09:00 • Oradea"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Buton de avansare cu îndemn clar */}
          <AnimatePresence>
            {(hasFinishedClock || isCompleted) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic text-rose-900/90 font-medium max-w-md text-center">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    {chapter.nextPrompt || "Și de aici încolo lucrurile au devenit și mai faine. Hai să vezi."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onChapterComplete(chapter.stageIndex);
                    onScrollToNext();
                  }}
                  className="group flex min-h-[56px] items-center gap-3 rounded-full bg-gradient-to-r from-rose-800 to-rose-950 px-9 py-4 text-base sm:text-lg font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
                >
                  <span>{chapter.nextButtonText || "Hai să vezi ➜"}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================
          CAPITOLUL 4: OFICIAL «NOI» (19 SEPTEMBRIE 2026)
         ======================================================== */}
      {chapter.id === 'official-us' && (
        <div className="flex flex-col items-center text-center">
          {/* Badge & Dată */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1 text-xs sm:text-sm font-semibold text-rose-800 uppercase tracking-wider">
            <span>{chapter.badge || "Capitolul 04 • Level up 🎉"}</span>
          </div>

          <div className="text-xs sm:text-sm font-medium text-rose-900/80">
            <span>{chapter.date || "4 septembrie → 19 septembrie 2026"}</span>
          </div>

          {/* Animația cinematografică de contopire: „tu” + „eu” -> „noi” */}
          <div className="my-10 flex h-36 w-full items-center justify-center">
            {!mergedWords ? (
              <div className="flex items-center justify-center gap-12 font-serif text-6xl font-light text-rose-950 sm:gap-24 sm:text-8xl md:text-9xl">
                <motion.span
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {chapter.words.first}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl sm:text-4xl text-rose-400 font-sans font-light"
                >
                  +
                </motion.span>
                <motion.span
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {chapter.words.second}
                </motion.span>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-5 font-serif text-7xl font-medium tracking-tight text-rose-900 sm:text-9xl drop-shadow-sm"
              >
                <span>{chapter.words.united}</span>
                <Heart className="h-14 w-14 sm:h-20 sm:w-20 fill-rose-600 text-rose-600" />
              </motion.div>
            )}
          </div>

          <h2 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl md:text-6xl">
            {chapter.title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-serif text-xl sm:text-2xl md:text-3xl italic leading-relaxed text-ink-muted">
            „{chapter.message}”
          </p>

          {/* CARDUL NOCTURN FACETIME (MUTAT AICI CONFORM CRONOLOGIEI PÂNĂ LA 19 SEPTEMBRIE) */}
          {chapter.facetimeMemory && (
            <div className="mt-10 mb-6 w-full text-left">
              <FaceTimeMemory memory={chapter.facetimeMemory} />
            </div>
          )}

          {/* Portretul de cuplu înrămat la momentul Oficial «Noi» */}
          <AnimatePresence>
            {mergedWords && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative mt-8 max-w-sm sm:max-w-md mx-auto"
              >
                {/* Aureolă caldă */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-rose-200/40 via-amber-200/30 to-rose-200/40 blur-xl" />
                
                {/* Ramă passe-partout de colecție */}
                <div className="relative rounded-2xl border-4 border-white bg-white/95 p-4 sm:p-5 shadow-[0_20px_50px_rgba(159,18,57,0.18)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-rose-100 bg-stone-100 shadow-inner">
                    <img
                      src="/photos/impreuna.jpg"
                      alt="Cati și Ștefan împreună"
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-4 right-4 text-left text-white drop-shadow-md">
                      <p className="font-serif text-lg sm:text-xl font-medium">
                        Cati & Ștefan
                      </p>
                      <p className="text-xs sm:text-sm text-rose-100/90 font-light">
                        {chapter.portrait?.title || "Cati & Ștefan • 19 septembrie 2026 • Împreună, dincolo de kilometri"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center justify-center gap-2 text-sm text-rose-800 font-serif italic">
                    <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                    <span>{chapter.portrait?.badge || "Momentul în care povestea a devenit a noastră"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200/90 px-5 py-2 text-xs sm:text-sm font-semibold text-rose-900 shadow-xs">
              <Sparkles className="h-4 w-4 text-rose-600" />
              <span>{chapter.finalPrompt?.badge || "Amintiri & Surprize 🎁"}</span>
            </div>

            <p className="max-w-lg font-serif text-base sm:text-lg italic text-rose-900/90 font-medium">
              {chapter.finalPrompt?.message || "Am adunat aici amintirile noastre speciale și o scrisoare secretă."}
            </p>

            <button
              type="button"
              onClick={() => {
                if (onChapterComplete) onChapterComplete(chapter.stageIndex);
                if (onScrollToNext) onScrollToNext();
              }}
              className="group mt-2 flex min-h-[56px] items-center gap-3 rounded-full bg-gradient-to-r from-rose-800 to-rose-950 px-9 py-4 text-base sm:text-lg font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
            >
              <span>Descoperă amintirile & surprizele noastre ➜</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default StoryChapter;

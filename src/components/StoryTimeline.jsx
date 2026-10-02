import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { StoryChapter } from './StoryChapter';

/**
 * StoryTimeline
 * Cronologia cinematică progresivă:
 * Conține bara de progres cu cele 4 repere (Suceava, Puntea, Revederea, Oficial Noi).
 * La deblocarea etapei 4, toate punctele se aprind și liniile se unesc luminos.
 */
export function StoryTimeline({
  chapters,
  unlockedStage,
  completedStages,
  onChapterComplete,
  onScrollToNext
}) {
  const isFinalStage = unlockedStage >= 6;

  const milestones = [
    { stage: 1, label: "Suceava", date: "28 mar" },
    { stage: 2, label: "Distanța", date: "primăvară" },
    { stage: 3, label: "Oradea", date: "1–4 sep" },
    { stage: 4, label: "Oficial Noi", date: "19 sep" },
    { stage: 5, label: "Amintiri", date: "surprize" },
    { stage: 6, label: "Scrisoarea", date: "2 oct" }
  ];

  return (
    <section
      id="story-timeline"
      aria-label="Cronologia amintirilor noastre"
      className="relative z-10 w-full py-6 sm:py-10"
    >
      {/* Bara de progres a cronologiei cu fundal opac solid */}
      <div className="sticky top-2 z-30 mx-auto mb-8 max-w-xl px-2 sm:top-4 sm:mb-12 sm:px-4">
        <div className="rounded-full border border-rose-200/90 bg-[#FFFDF9] px-3 py-2.5 shadow-[0_6px_25px_rgba(28,18,21,0.12)] sm:px-6 sm:py-3.5">
          <div className="relative flex items-center justify-between">
            {/* Linia de conexiune fundal */}
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-rose-100" />

            {/* Linia de progres activă sau unită complet */}
            <motion.div
              style={{
                width: isFinalStage
                  ? '100%'
                  : `${Math.min(100, Math.max(0, ((unlockedStage - 1) / 5) * 100))}%`
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`absolute top-1/2 left-0 h-0.5 -translate-y-1/2 ${
                isFinalStage
                  ? 'bg-gradient-to-r from-rose-500 via-rose-700 to-amber-500 shadow-sm'
                  : 'bg-rose-700'
              }`}
            />

            {/* Punctele de reper din cronologie */}
            {milestones.map((m) => {
              const isPastOrCurrent = unlockedStage >= m.stage || isFinalStage;
              const isCompleted = completedStages.includes(m.stage) || isFinalStage;

              return (
                <button
                  key={m.stage}
                  type="button"
                  disabled={!isPastOrCurrent}
                  onClick={() => {
                    if (isPastOrCurrent) {
                      onScrollToNext(m.stage);
                    }
                  }}
                  className={`relative z-10 flex flex-col items-center bg-transparent border-none p-0 focus:outline-none ${
                    isPastOrCurrent ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <motion.div
                    animate={
                      isFinalStage
                        ? { scale: [1, 1.15, 1], boxShadow: '0 0 12px rgba(190, 18, 60, 0.4)' }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: isFinalStage ? Infinity : 0 }}
                    className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-500 ${
                      isPastOrCurrent
                        ? 'border-2 border-rose-700 bg-rose-700 text-white shadow-sm'
                        : 'border-2 border-rose-200 bg-white text-stone-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 stroke-[2.5]" />
                    ) : (
                      <span>{m.stage}</span>
                    )}
                  </motion.div>

                  <div className="mt-1 flex flex-col items-center text-center">
                    <span
                      className={`text-[8px] sm:text-[11px] font-semibold whitespace-nowrap ${
                        isPastOrCurrent ? 'text-rose-900' : 'text-stone-400'
                      }`}
                    >
                      {m.label}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-stone-400 whitespace-nowrap hidden sm:block">
                      {m.date}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notificare romantică discretă despre parcurgerea capitolelor cu fundal solid opac */}
        {!isFinalStage && (
          <div className="mt-2 flex items-center justify-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-[#FFFDF9] px-3.5 py-1 text-[11px] sm:text-xs font-medium text-rose-900 shadow-xs">
              <Sparkles className="h-3 w-3 text-rose-500 inline shrink-0" />
              <span>Apasă pe butoanele din fiecare capitol ca să vezi ce urmează 👀</span>
            </span>
          </div>
        )}
      </div>

      {/* Capitolele dezvăluite progresiv */}
      <div className="space-y-16">
        {chapters.map((chapter) => {
          const isUnlocked = unlockedStage >= chapter.stageIndex;
          const isCompleted = completedStages.includes(chapter.stageIndex);

          if (!isUnlocked) return null;

          return (
            <StoryChapter
              key={chapter.id}
              chapter={chapter}
              isUnlocked={isUnlocked}
              isCompleted={isCompleted}
              onChapterComplete={onChapterComplete}
              onScrollToNext={() => onScrollToNext(chapter.stageIndex + 1)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default StoryTimeline;

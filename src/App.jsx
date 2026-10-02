import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { storyData } from './data/story';
import { ChapterThemeBackground } from './components/ChapterThemeBackground';
import { Story3DScene } from './components/Story3DScene';
import { SecretVault } from './components/SecretVault';
import { StoryTimeline } from './components/StoryTimeline';
import { Interactive3DHeart } from './components/Interactive3DHeart';
import { PhysicalWaxSealLetter } from './components/PhysicalWaxSealLetter';
import { PolaroidMemories } from './components/PolaroidMemories';
import { LoveCounter } from './components/LoveCounter';
import { TomorrowCapsule } from './components/TomorrowCapsule';

export function App() {
  // Starea progresivă a experienței:
  // 0: Seiful închis (capsula timpului)
  // 1: Suceava (Privirea din lobby)
  // 2: Puntea de distanță (Piatra Neamț ↔ Târgu Mureș)
  // 3: Revederea (Oradea, CDTO 2026, 03:00 → 09:00)
  // 4: Oficial «Noi» (19 septembrie 2026)
  // 5: Amintiri & Surprize (Inima 3D, Polaroide, Contor, Răvașe)
  // 6: Scrisoarea sigilată cu ceară roșie
  const [unlockedStage, setUnlockedStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [activeChapter, setActiveChapter] = useState(0);

  // Sincronizează fundalul cu etapa curentă la deblocare
  useEffect(() => {
    setActiveChapter(unlockedStage);
  }, [unlockedStage]);

  // Observer de derulare: la trecerea prin fiecare secțiune, fundalul și animațiile se sincronizează
  useEffect(() => {
    if (unlockedStage === 0) {
      setActiveChapter(0);
      return;
    }

    const sections = [
      { id: 'vault-section', chapter: 0 },
      { id: 'chapter-1', chapter: 1 },
      { id: 'chapter-2', chapter: 2 },
      { id: 'chapter-3', chapter: 3 },
      { id: 'chapter-4', chapter: 4 },
      { id: 'chapter-5', chapter: 5 },
      { id: 'final-letter-section', chapter: 6 }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            const matched = sections.find((s) => s.id === entry.target.id);
            if (matched) {
              setActiveChapter(matched.chapter);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-10% 0px -20% 0px',
        threshold: [0.2, 0.5]
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [unlockedStage]);

  // Handler de deblocare a primului capitol din seif
  const handleUnlockVault = () => {
    if (unlockedStage < 1) {
      setUnlockedStage(1);
      setActiveChapter(1);
    }
  };

  // Derulare lină către o secțiune
  const scrollToChapter = (stageNum) => {
    let el = null;
    if (stageNum >= 1 && stageNum <= 4) {
      el = document.getElementById(`chapter-${stageNum}`);
    } else if (stageNum === 5) {
      el = document.getElementById('chapter-5');
    } else if (stageNum === 6) {
      el = document.getElementById('final-letter-section');
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler de marcare a completării unei etape și deblocare progresivă
  const handleChapterComplete = (stageIndex) => {
    setCompletedStages((prev) => {
      if (!prev.includes(stageIndex)) {
        return [...prev, stageIndex];
      }
      return prev;
    });

    const nextStage = stageIndex + 1;
    if (nextStage > unlockedStage && nextStage <= 6) {
      setUnlockedStage(nextStage);
      setActiveChapter(nextStage);
    }
  };

  // Handler de avansare la capitolul următor cu derulare consecutivă
  const handleScrollToNext = (nextStageIndex) => {
    if (nextStageIndex > unlockedStage) {
      setUnlockedStage(nextStageIndex);
      setActiveChapter(nextStageIndex);
    }
    setTimeout(() => {
      scrollToChapter(nextStageIndex);
    }, 120);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#1C1215] font-sans selection:bg-rose-200 selection:text-rose-900 transition-colors duration-1000">
      {/* Fundal dinamic și animații tematice specifice fiecărui capitol */}
      <ChapterThemeBackground activeChapter={activeChapter} />

      {/* Scenă 3D WebGL de fundal cu petale de trandafir și stardust în mișcare (60 FPS) */}
      <Story3DScene stage={activeChapter} />

      {/* Header discret vizibil după deblocare */}
      {unlockedStage > 0 && (
        <header
          role="banner"
          className="relative z-20 flex w-full flex-col items-center justify-between gap-1.5 border-b border-rose-200/90 bg-[#FFFDF9] px-4 py-3 sm:flex-row sm:px-8 sm:py-4 shadow-xs text-center sm:text-left"
        >
          <div className="font-serif text-base sm:text-lg font-medium tracking-wide text-rose-950">
            Cati & Ștefan
          </div>
          <div className="text-[11px] sm:text-xs font-medium tracking-wider text-ink-subtle">
            Piatra Neamț ↔ Târgu Mureș (da, e departe, nu ne pasă)
          </div>
        </header>
      )}

      {/* Conținutul principal cu reveal strict consecutiv și progresiv */}
      <main id="main-content" className="relative z-10 mx-auto max-w-4xl">
        {/* ETAPA 0: SEIFUL AMINTIRILOR */}
        <SecretVault
          isUnlocked={unlockedStage > 0}
          onUnlock={handleUnlockVault}
          onScrollToFirstChapter={() => scrollToChapter(1)}
        />

        {/* ETAPELE 1 - 4: CRONOLOGIA CINEMATICĂ PROGRESIVĂ */}
        {unlockedStage > 0 && (
          <StoryTimeline
            chapters={storyData.chapters}
            unlockedStage={unlockedStage}
            completedStages={completedStages}
            onChapterComplete={handleChapterComplete}
            onScrollToNext={handleScrollToNext}
          />
        )}

        {/* ETAPA 5: SURPRIZELE & AMINTIRILE NOASTRE (apare strict la sfârșit după Capitolul 4) */}
        {unlockedStage >= 5 && (
          <section
            id="chapter-5"
            aria-label="Capitolul 5 • Amintiri și Surprize"
            className="relative z-10 my-16 space-y-14"
          >
            {/* ELEMENT 3D INTERACTIV: INIMA NOASTRĂ 3D & PULSUL IUBIRII */}
            <Interactive3DHeart />

            {/* ELEMENT SURPRIZĂ: BILEȚELE DIN BUZUNAR (KEEPSAKES) */}
            <PolaroidMemories />

            {/* ELEMENT SURPRIZĂ: CRONOMETRUL IUBIRII NOASTRE */}
            <LoveCounter />

            {/* ELEMENT SURPRIZĂ: UN RĂVAȘ PENTRU ZIUA DE MÂINE */}
            <TomorrowCapsule />

            {/* BUTON PROGRESIV CONSECUTIV LA SFÂRȘITUL ETAPEI 5 PENTRU SCRISOARE */}
            <div className="flex flex-col items-center justify-center pt-8 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200/90 px-5 py-2 text-xs sm:text-sm font-semibold text-rose-900 shadow-xs">
                <span>Ultimul secret te așteaptă 💌</span>
              </div>
              <p className="mb-4 max-w-md font-serif text-base sm:text-lg italic text-rose-900/90 font-medium">
                A rămas o scrisoare închisă în ceară roșie. Apasă și citește ce am scris pentru tine.
              </p>
              <button
                type="button"
                onClick={() => handleScrollToNext(6)}
                className="group flex min-h-[56px] items-center gap-3 rounded-full bg-gradient-to-r from-rose-800 to-rose-950 px-9 py-4 text-base sm:text-lg font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
              >
                <span>Deschide scrisoarea de la Ștefan 💌 ➜</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </section>
        )}

        {/* ETAPA 6 (FINALĂ): PLICUL ȘI SCRISOAREA CU SIGILIU DE CEARĂ ROȘIE */}
        {unlockedStage >= 6 && (
          <PhysicalWaxSealLetter isVisible={true} />
        )}
      </main>

      {/* Footer discret când povestea a fost complet dezvăluită */}
      {unlockedStage >= 6 && (
        <footer className="relative z-10 border-t border-rose-100/80 py-10 text-center text-xs text-ink-subtle">
          <p className="font-serif text-sm italic text-rose-900/90">
            „Te iubesc dincolo de kilometri, catiii 🫶”
          </p>
          <p className="mt-1">
            1 lună de noi 🥹 • 2 octombrie 2026 • făcut cu drag de Ștefan
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;

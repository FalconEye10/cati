import React, { useState, useEffect } from 'react';
import { storyData } from './data/story';
import { ChapterThemeBackground } from './components/ChapterThemeBackground';
import { Story3DScene } from './components/Story3DScene';
import { SecretVault } from './components/SecretVault';
import { StoryTimeline } from './components/StoryTimeline';
import { Interactive3DHeart } from './components/Interactive3DHeart';
import { PhysicalWaxSealLetter } from './components/PhysicalWaxSealLetter';
import { TurntablePlayer } from './components/TurntablePlayer';
import { PolaroidMemories } from './components/PolaroidMemories';
import { LoveCounter } from './components/LoveCounter';
import { TomorrowCapsule } from './components/TomorrowCapsule';

export function App() {
  // Starea progresivă a experienței:
  // 0: Doar seiful închis este vizibil (nimic altceva)
  // 1: Suceava deblocată
  // 2: Puntea de distanță deblocată
  // 3: Revederea deblocată
  // 4: Oficial Noi + Plicul cu ceară deblocate
  const [unlockedStage, setUnlockedStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [activeChapter, setActiveChapter] = useState(0);

  // Când deblochezi o etapă nouă, fundalul și animațiile se sincronizează imediat
  useEffect(() => {
    setActiveChapter(unlockedStage);
  }, [unlockedStage]);

  // Observer de derulare: la trecerea prin fiecare capitol, fundalul se metamorfozează fluid
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
      { id: 'final-letter-section', chapter: 5 }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
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
        threshold: [0.25, 0.5]
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

  // Derulare lină către un capitol anume
  const scrollToChapter = (stageNum) => {
    const el = document.getElementById(`chapter-${stageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler de marcare a completării unei etape și avansare
  const handleChapterComplete = (stageIndex) => {
    setCompletedStages((prev) => {
      if (!prev.includes(stageIndex)) {
        return [...prev, stageIndex];
      }
      return prev;
    });

    // Deblochează etapa următoare dacă este cazul
    const nextStage = stageIndex + 1;
    if (nextStage > unlockedStage && nextStage <= 4) {
      setUnlockedStage(nextStage);
      setActiveChapter(nextStage);
    }
  };

  const handleScrollToNext = (nextStageIndex) => {
    if (nextStageIndex <= 4) {
      if (nextStageIndex > unlockedStage) {
        setUnlockedStage(nextStageIndex);
        setActiveChapter(nextStageIndex);
      }
      setTimeout(() => {
        scrollToChapter(nextStageIndex);
      }, 150);
    } else {
      setActiveChapter(5);
      // Derulează la plicul sigilat
      const letterSection = document.getElementById('final-letter-section');
      if (letterSection) {
        letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#1C1215] font-sans selection:bg-rose-200 selection:text-rose-900 transition-colors duration-1000">
      {/* Fundal dinamic și animații tematice specifice fiecărui capitol (Cupidon, Stele & Meteori, Fluturi 3D, Cascade de inimi) */}
      <ChapterThemeBackground activeChapter={activeChapter} />

      {/* Scenă 3D WebGL de fundal cu petale de trandafir și stardust în mișcare (60 FPS) */}
      <Story3DScene stage={activeChapter} />

      {/* Turntable Player Audio (Vinil cu pornire exclusiv la cererea utilizatoarei) */}
      <TurntablePlayer />

      {/* Header discret vizibil doar după deblocare */}
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

      {/* Conținutul principal cu reveal progresiv */}
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

        {/* ELEMENT 3D INTERACTIV: INIMA NOASTRĂ 3D & PULSUL IUBIRII */}
        {unlockedStage >= 2 && (
          <Interactive3DHeart />
        )}

        {/* ELEMENT SURPRIZĂ: BILEȚELE DIN BUZUNAR (KEEPSAKES) */}
        {unlockedStage >= 2 && (
          <PolaroidMemories />
        )}

        {/* ELEMENT SURPRIZĂ: CRONOMETRUL IUBIRII NOASTRE */}
        {unlockedStage >= 4 && (
          <LoveCounter />
        )}

        {/* ELEMENT SURPRIZĂ: UN RĂVAȘ PENTRU ZIUA DE MÂINE */}
        {unlockedStage >= 4 && (
          <TomorrowCapsule />
        )}

        {/* ETAPA FINALĂ: PLICUL ȘI SCRISOAREA CU SIGILIU DE CEARĂ ROȘIE */}
        {unlockedStage >= 4 && (
          <PhysicalWaxSealLetter isVisible={true} />
        )}
      </main>

      {/* Footer discret când povestea a fost dezvăluită */}
      {unlockedStage >= 4 && (
        <footer className="relative z-10 border-t border-rose-100/80 py-10 text-center text-xs text-ink-subtle">
          <p className="font-serif text-sm italic text-rose-900/90">
            „Te iubesc dincolo de kilometri, catiii 🫶”
          </p>
          <p className="mt-1">
            1 lună de noi 🥹 • 2 octombrie 2026 • făcut cu drag (și cu mult cod) de Ștefan
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;

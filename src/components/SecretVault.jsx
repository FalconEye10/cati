import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Unlock, ChevronDown, Sparkles } from 'lucide-react';
import { storyData } from '../data/story';
import { playVaultUnlockSound, playDialTickSound } from '../utils/soundEffects';
import { Vault3D } from './Vault3D';

/**
 * SecretVault
 * Experiență cinematică mecanică a Seifului Secret 3D:
 * Include o ușă 3D masivă de seif din oțel forjat și alamă șlefuită,
 * roată de manevră cu 3 spițe, bolțuri mobile de siguranță,
 * deschidere cu perspectivă tridimensională și interior cald iluminat.
 */
export function SecretVault({ isUnlocked, onUnlock, onScrollToFirstChapter }) {
  const [vaultState, setVaultState] = useState(isUnlocked ? 'opened' : 'locked'); 
  // 'locked' | 'dialing' | 'unlocking-bolts' | 'opening-door' | 'opened'
  const { vault } = storyData;

  const handleOpenClick = () => {
    if (vaultState === 'opened' || isUnlocked) {
      if (onScrollToFirstChapter) {
        onScrollToFirstChapter();
      }
      return;
    }

    if (vaultState !== 'locked') return;

    // Faza 1: Rotire secvențială a cadranului de combinație (0ms - 800ms)
    setVaultState('dialing');
    playDialTickSound();

    // Faza 2: Retragerea bolțurilor mecanice de oțel (850ms - 1300ms)
    setTimeout(() => {
      setVaultState('unlocking-bolts');
      playDialTickSound();
    }, 850);

    // Faza 3: Deschiderea ușii seifului în perspectivă 3D (1350ms - 1900ms)
    setTimeout(() => {
      setVaultState('opening-door');
      playVaultUnlockSound();
    }, 1350);

    // Faza 4: Deblocare completă și trecere la poveste (2000ms)
    setTimeout(() => {
      setVaultState('opened');
      onUnlock();
      setTimeout(() => {
        if (onScrollToFirstChapter) {
          onScrollToFirstChapter();
        }
      }, 500);
    }, 2000);
  };

  const isDialing = vaultState === 'dialing';
  const doorOpened = vaultState === 'opening-door' || vaultState === 'opened';

  return (
    <section
      id="vault-section"
      aria-label="Seiful amintirilor"
      className="relative z-10 flex min-h-[92vh] w-full items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Adâncime ambientală caldă */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-b from-amber-100/40 via-rose-100/30 to-transparent blur-3xl pointer-events-none" />

        {/* CONTAINERUL SEIFULUI CINEMATIC */}
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE5] p-6 shadow-[0_25px_60px_-15px_rgba(28,18,21,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-md sm:p-10">
          
          {/* Badge superior */}
          <div className="mb-4 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-wider text-rose-900/85 uppercase">
            <span className="h-[1px] w-8 bg-rose-900/20" />
            <span>{vault.badge}</span>
            <span className="h-[1px] w-8 bg-rose-900/20" />
          </div>

          {/* APARATUL MECANIC AL SEIFULUI 3D REAL RANDAT CU THREE.JS */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            <Vault3D
              vaultState={vaultState}
              onTriggerUnlock={handleOpenClick}
            />
            <span className="mt-2 text-xs font-serif italic text-rose-900/70">
              {vault.instruction3D || "Apasă sau trage de volan ca să deschizi seiful"}
            </span>
          </div>

          {/* Titlu & descriere editorială */}
          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl md:text-6xl leading-[1.12]">
            {vault.title}
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg md:text-xl font-light">
            {vault.subtitle}
          </p>

          {/* Butonul mecanic de acționare */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={handleOpenClick}
              disabled={isDialing || vaultState === 'unlocking-bolts' || vaultState === 'opening-door'}
              className={`group relative flex min-h-[56px] items-center justify-center gap-3 rounded-full px-9 py-4 text-base font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer ${
                doorOpened
                  ? 'border border-amber-900/20 bg-amber-50/80 text-rose-950 hover:bg-amber-100 text-base sm:text-lg'
                  : 'bg-gradient-to-r from-rose-800 via-rose-900 to-[#4A0A1C] text-white shadow-[0_10px_25px_-5px_rgba(159,18,57,0.35)] hover:scale-[1.02] hover:shadow-[0_15px_30px_-5px_rgba(159,18,57,0.45)] active:scale-[0.98] text-base sm:text-lg'
              }`}
            >
              {doorOpened ? (
                <>
                  <Unlock className="h-5 w-5 text-rose-700" />
                  <span>Mecanismul este deschis • Pășește în poveste</span>
                  <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                </>
              ) : (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                  </span>
                  <span>
                    {isDialing
                      ? 'Se descifrează combinația...'
                      : vaultState === 'unlocking-bolts'
                      ? 'Se retrag bolțurile de oțel...'
                      : vault.openButtonText}
                  </span>
                </>
              )}
            </button>

            {!doorOpened && (
              <div className="mt-2 flex items-center justify-center gap-2 max-w-md text-center">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <p className="text-sm sm:text-base font-serif italic text-rose-900/90 font-medium leading-relaxed">
                  {vault.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecretVault;

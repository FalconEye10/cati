import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * ChapterThemeBackground
 * Fundal dinamic și atmosferic pentru fiecare capitol în parte:
 * - Capitolul 0 (Seif): Cămară secretă misterioasă, tăciuni calzi de lumânare & rune de cifru aurite.
 * - Capitolul 1 (Suceava • Privirea din lobby): Zori primăvăratice de blush rose & Cupidon animat în zbor, cu aripi bătătoare, trăgând cu arcul cu săgeți de inimă și lăsând jerbe de petale și bule de inimi!
 * - Capitolul 2 (Puntea & FaceTime): Noapte înstelată profundă (cer de munte între Moldova și Transilvania), constelație în formă de inimă, stele căzătoare (meteori) cu dâre luminoase, licurici bioluminescenți și unde radio de FaceTime.
 * - Capitolul 3 (Revederea la Oradea • Zori de zi): Răsărit auriu cald (zori de 4 septembrie), fluturi aurii 3D cu aripi ce bat în perspectivă, raze solare volumetrice și polen auriu.
 * - Capitolul 4 (Oficial «Noi»): Sărbătoare regală de dragoste în tonuri de șampanie și rubin, cascade de inimi plutitoare 3D, heruvimi zburători și jerbe de sclipiri.
 * - Capitolul 5 (Scrisoare): Pergament cald de bumbac, lumină intimă de lumânare și stardust auriu.
 */
export function ChapterThemeBackground({ activeChapter = 0 }) {
  // Verificare preferințe mișcare redusă
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stare pentru săgeata lui Cupidon (Capitolul 1)
  const [cupidArrowKey, setCupidArrowKey] = useState(0);

  useEffect(() => {
    if (activeChapter === 1 && !prefersReducedMotion) {
      const interval = setInterval(() => {
        setCupidArrowKey((prev) => prev + 1);
      }, 5500);
      return () => clearInterval(interval);
    }
  }, [activeChapter, prefersReducedMotion]);

  // Constelația de stele pentru Capitolul 2
  const stars = useMemo(() => {
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: (i * 17.3 + (i % 7) * 11) % 98 + 1,
      y: (i * 23.7 + (i % 5) * 13) % 94 + 2,
      size: (i % 3) * 0.8 + 1.2,
      delay: (i % 7) * 0.6,
      duration: 2 + (i % 5) * 0.8
    }));
  }, []);

  // Licuricii pentru Capitolul 2
  const fireflies = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${(i * 7 + 12) % 90}%`,
      top: `${(i * 11 + 15) % 85}%`,
      size: 4 + (i % 4) * 2,
      duration: 4 + (i % 3) * 2,
      delay: (i % 5) * 0.7
    }));
  }, []);

  // Inimile plutitoare pentru Capitolul 4
  const floatingHeartsCh4 = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${(i * 3.8 + 2) % 96}%`,
      size: 16 + (i % 5) * 8,
      duration: 7 + (i % 4) * 2.5,
      delay: (i % 8) * 0.9,
      color:
        i % 4 === 0
          ? '#BE123C' // carmine
          : i % 4 === 1
          ? '#F43F5E' // rose
          : i % 4 === 2
          ? '#F59E0B' // gold
          : '#FB7185' // blush
    }));
  }, []);

  // Fluturii aurii pentru Capitolul 3
  const butterflies = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: `${(i * 14 + 8) % 88}%`,
      top: `${75 - (i % 4) * 18}%`,
      scale: 0.7 + (i % 3) * 0.25,
      duration: 10 + (i % 4) * 3,
      delay: i * 1.6
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <style>{`
        @keyframes cupidWingFlap {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(-28deg) scaleY(0.7); }
        }
        @keyframes cupidFlyGlide {
          0% { transform: translate(-10%, 15px) scale(0.95); }
          25% { transform: translate(25vw, -10px) scale(1.02); }
          50% { transform: translate(55vw, 20px) scale(0.98); }
          75% { transform: translate(80vw, -5px) scale(1.03); }
          100% { transform: translate(105vw, 15px) scale(0.95); }
        }
        @keyframes cupidArrowShot {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          15% { opacity: 1; transform: translate(60px, -25px) scale(1); }
          85% { opacity: 1; transform: translate(380px, -140px) scale(1); }
          100% { transform: translate(460px, -170px) scale(1.4); opacity: 0; }
        }
        @keyframes butterflyFlapLeft {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.12); }
        }
        @keyframes butterflyFlapRight {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.12); }
        }
        @keyframes butterflyFloatPath {
          0% { transform: translate(0, 0) rotate(-6deg); }
          30% { transform: translate(35px, -60px) rotate(8deg); }
          60% { transform: translate(-25px, -140px) rotate(-10deg); }
          100% { transform: translate(40px, -230px) rotate(6deg); }
        }
        @keyframes shootingStarFly {
          0% { transform: translateX(0) translateY(0) rotate(-35deg) scaleX(0); opacity: 0; }
          10% { transform: translateX(40px) translateY(30px) rotate(-35deg) scaleX(1); opacity: 1; }
          70% { transform: translateX(360px) translateY(260px) rotate(-35deg) scaleX(1.3); opacity: 0.8; }
          100% { transform: translateX(480px) translateY(340px) rotate(-35deg) scaleX(0.2); opacity: 0; }
        }
        @keyframes fireflyPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8) translate(0, 0); }
          50% { opacity: 0.95; transform: scale(1.25) translate(15px, -12px); }
        }
        @keyframes floatingHeartRise {
          0% { transform: translateY(105vh) scale(0.7) rotate(-5deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { opacity: 0.75; }
          100% { transform: translateY(-10vh) scale(1.15) rotate(12deg); opacity: 0; }
        }
        @keyframes sunbeamGlow {
          0%, 100% { opacity: 0.25; transform: rotate(-25deg) scaleY(1); }
          50% { opacity: 0.45; transform: rotate(-23deg) scaleY(1.08); }
        }
        @keyframes vaultDialSlowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* ========================================================
          CAPITOLUL 0: SEIFUL AMINTIRILOR
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradientul nocturn de cămară veche de seif */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#10070B] via-[#1B0B13] to-[#0A0407]" />
        
        {/* Aură luminoasă caldă de chihlimbar în centrul seifului */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-gradient-to-r from-amber-600/15 via-rose-600/15 to-transparent blur-[120px]" />

        {/* Cadran radial ezoteric cu rotație lentă */}
        <div
          style={{ animation: prefersReducedMotion ? 'none' : 'vaultDialSlowSpin 90s linear infinite' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full border border-amber-500/10 opacity-30 pointer-events-none"
        >
          <div className="absolute inset-4 rounded-full border border-dashed border-rose-500/10" />
          <div className="absolute inset-16 rounded-full border border-amber-300/5" />
        </div>

        {/* Tăciuni calzi / particule de chihlimbar plutind discret */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ['100vh', '-5vh'],
                  x: [(i * 30) % 60, ((i * 30) % 60) + (i % 2 === 0 ? 35 : -35)],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 8 + (i % 5) * 2,
                  repeat: Infinity,
                  delay: (i % 6) * 1.2,
                  ease: 'easeInOut'
                }}
                style={{
                  left: `${(i * 19 + 5) % 92}%`,
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`
                }}
                className="absolute rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          CAPITOLUL 1: SUCEAVA • PRIVIREA DIN LOBBY
          (Gradient Primăvară Blush Rose & Cupidon Zburător cu Săgeți de Inimi)
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradientul delicat de trandafir & ivoriu */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8] via-[#FFE4EC] to-[#FCE7F3]" />

        {/* Aură romantică de lumină filtrată */}
        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-rose-200/40 blur-[130px]" />
        <div className="absolute top-1/2 -right-20 h-[600px] w-[600px] rounded-full bg-pink-100/50 blur-[140px]" />

        {/* CUPIDON ANIMAȚIE DE ZBOR (CUPID FLYING ACROSS SKY) */}
        {!prefersReducedMotion && (
          <div
            style={{
              animation: 'cupidFlyGlide 24s ease-in-out infinite'
            }}
            className="absolute top-14 left-0 z-10 w-28 h-28 pointer-events-none"
          >
            {/* Cupidon SVG complet cu aripi articulate & arc auriu */}
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full drop-shadow-[0_8px_16px_rgba(225,29,72,0.22)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Aură de lumină aurie în jurul lui Cupidon */}
              <circle cx="60" cy="55" r="32" fill="#FDE68A" opacity="0.35" className="animate-pulse" />

              {/* Aripa Stângă (Articulată & Bătătoare) */}
              <g
                style={{
                  transformOrigin: '48px 48px',
                  animation: 'cupidWingFlap 0.75s ease-in-out infinite'
                }}
              >
                <path
                  d="M 48 48 C 30 25, 10 35, 12 55 C 14 68, 32 65, 48 56 Z"
                  fill="url(#cupid-wing-gradient)"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                />
                {/* Pene detaliu */}
                <path d="M 22 45 Q 35 52 46 51" stroke="#FDE68A" strokeWidth="1" />
                <path d="M 28 55 Q 38 58 46 54" stroke="#FDE68A" strokeWidth="1" />
              </g>

              {/* Corpul lui Cupidon (Siluetă caldă rose-coral) */}
              {/* Piciorușe drăgălașe */}
              <ellipse cx="44" cy="74" rx="8" ry="5" fill="#FDA4AF" transform="rotate(-20 44 74)" />
              <ellipse cx="38" cy="79" rx="7" ry="4" fill="#FB7185" transform="rotate(-30 38 79)" />

              {/* Tors */}
              <ellipse cx="58" cy="62" rx="14" ry="12" fill="#FDA4AF" />

              {/* Capul lui Cupidon */}
              <circle cx="68" cy="46" r="11" fill="#FECDD3" />
              {/* Păr buclat auriu */}
              <path
                d="M 60 40 Q 64 33 72 35 Q 78 35 80 42 Q 81 48 76 49 Q 68 44 60 40 Z"
                fill="#F59E0B"
              />
              <circle cx="62" cy="38" r="3.5" fill="#F59E0B" />
              <circle cx="69" cy="34" r="4" fill="#FBBF24" />
              <circle cx="76" cy="36" r="3.5" fill="#F59E0B" />

              {/* Ochișori & obrăjori */}
              <circle cx="72" cy="46" r="1.5" fill="#881337" />
              <circle cx="70" cy="49" r="2.5" fill="#F43F5E" opacity="0.6" />

              {/* Aripa Dreaptă */}
              <g
                style={{
                  transformOrigin: '54px 48px',
                  animation: 'cupidWingFlap 0.75s ease-in-out infinite 0.1s'
                }}
              >
                <path
                  d="M 54 48 C 45 20, 25 22, 28 42 C 30 54, 44 55, 54 52 Z"
                  fill="url(#cupid-wing-gradient)"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                />
              </g>

              {/* Mâinile care țin arcul */}
              <ellipse cx="74" cy="58" rx="5" ry="3.5" fill="#FDA4AF" transform="rotate(15 74 58)" />
              <ellipse cx="80" cy="52" rx="4" ry="3" fill="#FDA4AF" />

              {/* Arcul Auriu */}
              <path
                d="M 76 34 Q 92 52 76 72"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Coarda arcului */}
              <line x1="76" y1="34" x2="76" y2="72" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="2 1" />

              {/* Săgeata cu vârf de inimă roșie carmin */}
              <line x1="68" y1="53" x2="88" y2="53" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              {/* Pene la capătul săgeții */}
              <path d="M 66 50 L 70 53 L 66 56" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              {/* Vârf de inimă roșie */}
              <path
                d="M 88 53 L 85 50 C 83 48, 81 50, 83 52 L 88 53 L 83 54 C 81 56, 83 58, 85 56 Z"
                fill="#E11D48"
              />

              <defs>
                <linearGradient id="cupid-wing-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#FEF3C7" />
                  <stop offset="100%" stopColor="#FDE68A" />
                </linearGradient>
              </defs>
            </svg>

            {/* SĂGEATA LUI CUPIDON CARE ZBOARĂ PERIODIC (SHOOTING ARROW) */}
            <div
              key={cupidArrowKey}
              style={{
                animation: 'cupidArrowShot 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
              className="absolute top-10 left-16 flex items-center pointer-events-none"
            >
              {/* Dâra strălucitoare a săgeții */}
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-300 to-rose-500 shadow-[0_0_8px_#f43f5e]" />
              {/* Inima strălucitoare din vârful săgeții */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 -ml-1 fill-rose-600 text-rose-600 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {/* Sclipiri de stardust în urma săgeții */}
              <span className="text-[11px] -ml-6 -mt-3 text-amber-400 animate-ping">✦</span>
              <span className="text-[9px] -ml-12 mt-3 text-rose-400 animate-pulse">✨</span>
            </div>
          </div>
        )}

        {/* Bule de inimi plutitoare delicate în fundal */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ['105vh', '-10vh'],
                  x: [0, (i % 2 === 0 ? 30 : -30)],
                  opacity: [0, 0.6, 0],
                  scale: [0.7, 1.1]
                }}
                transition={{
                  duration: 10 + (i % 4) * 3,
                  repeat: Infinity,
                  delay: (i % 7) * 1.5,
                  ease: 'easeInOut'
                }}
                style={{
                  left: `${(i * 13 + 6) % 94}%`,
                  bottom: 0
                }}
                className="absolute flex items-center justify-center text-rose-400/50"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-rose-300/40">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          CAPITOLUL 2: PUNTEA DINTRE NOI & FACETIME
          (Noapte Înstelată Profundă, Constelație Inimă, Meteori & Licurici)
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradientul de noapte peste munți (Cosmic Indigo & Sapphire Violet) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080314] via-[#110626] to-[#1C0D38]" />

        {/* Aură celestă moale în centru pentru lizibilitate impecabilă */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[650px] w-[900px] rounded-full bg-indigo-900/20 blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-purple-950/30 blur-[130px]" />

        {/* CÂMPUL DE STELE SCÂNTEIETOARE (TWINKLING STARS) */}
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: prefersReducedMotion
                ? 'none'
                : `fireflyPulse ${star.duration}s ease-in-out infinite ${star.delay}s`
            }}
            className="absolute rounded-full bg-white shadow-[0_0_5px_#ffffff]"
          />
        ))}

        {/* CONSTELAȚIA ÎN FORMĂ DE INIMĂ DINTRE ORAȘE */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <defs>
            <linearGradient id="constellation-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>
          </defs>
          {/* Linii stelare fine care conturează o inimă între stele */}
          <path
            d="M 280 140 Q 320 90 360 140 Q 400 90 440 140 Q 440 190 360 250 Q 280 190 280 140 Z"
            stroke="url(#constellation-glow)"
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
            className="animate-pulse"
          />
          {/* Noduri stelare principale */}
          <circle cx="280" cy="140" r="3" fill="#A5B4FC" className="shadow-[0_0_8px_#818cf8]" />
          <circle cx="360" cy="140" r="3.5" fill="#F472B6" className="shadow-[0_0_8px_#f472b6]" />
          <circle cx="440" cy="140" r="3" fill="#FDE68A" className="shadow-[0_0_8px_#fde68a]" />
          <circle cx="360" cy="250" r="4" fill="#F43F5E" className="shadow-[0_0_12px_#f43f5e]" />
        </svg>

        {/* STELE CĂZĂTOARE (METEORS / SHOOTING STARS) */}
        {!prefersReducedMotion && (
          <>
            <div
              style={{
                top: '12%',
                left: '18%',
                animation: 'shootingStarFly 5.5s linear infinite 0.8s'
              }}
              className="absolute w-44 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-white pointer-events-none"
            />
            <div
              style={{
                top: '28%',
                left: '55%',
                animation: 'shootingStarFly 6.8s linear infinite 3.2s'
              }}
              className="absolute w-52 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-white pointer-events-none"
            />
          </>
        )}

        {/* LICURICI BIOLUMINESCENȚI (FIREFLIES) */}
        {!prefersReducedMotion &&
          fireflies.map((ff) => (
            <div
              key={ff.id}
              style={{
                left: ff.left,
                top: ff.top,
                width: `${ff.size}px`,
                height: `${ff.size}px`,
                animation: `fireflyPulse ${ff.duration}s ease-in-out infinite ${ff.delay}s`
              }}
              className="absolute rounded-full bg-amber-300 shadow-[0_0_14px_4px_rgba(245,158,11,0.7)]"
            />
          ))}
      </div>

      {/* ========================================================
          CAPITOLUL 3: REVEDEREA LA ORADEA • ZORI DE ZI
          (Răsărit Auriu, Fluturi Aurii 3D & Raze Solare Volumetrice)
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradientul de răsărit de soare peste Oradea */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF5] via-[#FEF3C7] to-[#FDE68A]" />

        {/* Raze de soare volumetrice (God Rays) care coboară din colț */}
        <div
          style={{ animation: prefersReducedMotion ? 'none' : 'sunbeamGlow 12s ease-in-out infinite alternate' }}
          className="absolute -top-32 -left-20 w-[950px] h-[750px] pointer-events-none"
        >
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(253,230,138,0.45)_0%,rgba(254,243,199,0.2)_45%,transparent_70%)]" />
        </div>

        {/* Discul cald al soarelui de dimineață */}
        <div className="absolute top-10 right-12 h-44 w-44 rounded-full bg-gradient-to-br from-amber-200 via-rose-200 to-amber-300/40 blur-2xl opacity-70" />

        {/* FLUTURI AURII 3D CU BĂTAIE REALISTĂ DIN ARIPI */}
        {!prefersReducedMotion &&
          butterflies.map((b) => (
            <div
              key={b.id}
              style={{
                left: b.left,
                top: b.top,
                transform: `scale(${b.scale})`,
                animation: `butterflyFloatPath ${b.duration}s ease-in-out infinite ${b.delay}s`
              }}
              className="absolute z-10 w-10 h-10 pointer-events-none"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Aripa Stângă */}
                <div
                  style={{
                    transformOrigin: 'right center',
                    animation: 'butterflyFlapLeft 0.35s ease-in-out infinite'
                  }}
                  className="w-4 h-6 rounded-l-full bg-gradient-to-bl from-amber-400 via-amber-300 to-amber-500 shadow-xs border-r border-amber-600/40"
                />
                {/* Corpul fluturelui */}
                <div className="w-1 h-5 rounded-full bg-amber-950 z-20 shadow-xs" />
                {/* Aripa Dreaptă */}
                <div
                  style={{
                    transformOrigin: 'left center',
                    animation: 'butterflyFlapRight 0.35s ease-in-out infinite'
                  }}
                  className="w-4 h-6 rounded-r-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 shadow-xs border-l border-amber-600/40"
                />
              </div>
            </div>
          ))}

        {/* Polen auriu plutind în bătaia soarelui */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ['100vh', '-5vh'],
                  x: [0, (i % 2 === 0 ? 25 : -25)],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 9 + (i % 4) * 2.5,
                  repeat: Infinity,
                  delay: (i % 6) * 1.3,
                  ease: 'easeInOut'
                }}
                style={{
                  left: `${(i * 17 + 4) % 94}%`,
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`
                }}
                className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_#fde68a]"
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          CAPITOLUL 4: OFICIAL «NOI» (19 SEPTEMBRIE 2026)
          (Cascade de Inimi Plutitoare 3D, Heruvimi & Sărbătoare de Iubire)
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gradientul de sărbătoare: roz șampanie & petale de rubin */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F3] via-[#FFE4E6] to-[#FECDD3]" />

        {/* Aureolă centrală intensă de pasiune */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-gradient-to-r from-rose-400/25 via-pink-400/20 to-amber-300/20 blur-[130px]" />

        {/* HERUVIMI DE COLȚ CU GHIRLANDE DE INIMI */}
        <div className="absolute top-8 left-6 w-20 h-20 opacity-45 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-700 animate-pulse">
            <path d="M50 25 C30 5, 5 30, 25 55 L50 80 L75 55 C95 30, 70 5, 50 25 Z" fill="#E11D48" opacity="0.3" />
            <circle cx="50" cy="38" r="12" fill="#F59E0B" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-8 right-6 w-20 h-20 opacity-45 pointer-events-none scale-x-[-1]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-700 animate-pulse">
            <path d="M50 25 C30 5, 5 30, 25 55 L50 80 L75 55 C95 30, 70 5, 50 25 Z" fill="#E11D48" opacity="0.3" />
            <circle cx="50" cy="38" r="12" fill="#F59E0B" opacity="0.6" />
          </svg>
        </div>

        {/* CASCADE SPECTACULOASE DE INIMI PLUTITOARE 3D */}
        {!prefersReducedMotion &&
          floatingHeartsCh4.map((h) => (
            <div
              key={h.id}
              style={{
                left: h.left,
                animation: `floatingHeartRise ${h.duration}s ease-in-out infinite ${h.delay}s`
              }}
              className="absolute bottom-0 pointer-events-none drop-shadow-md"
            >
              <svg
                style={{ width: `${h.size}px`, height: `${h.size}px` }}
                viewBox="0 0 24 24"
                fill={h.color}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ))}
      </div>

      {/* ========================================================
          CAPITOLUL 5: PLICUL & SCRISOAREA CU SIGILIU DE CEARĂ
          (Lumină de Lumânare, Pergament Bumbac & Stardust Cald)
         ======================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeChapter >= 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FEF3C7]/40 to-[#FAF5EC]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-[550px] w-[750px] rounded-full bg-amber-200/35 blur-[140px]" />
      </div>

      {/* Granulație organică fină de peliculă / hârtie peste toate fundalurile */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03] mix-blend-color-burn">
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-texture)" />
      </svg>
    </div>
  );
}

export default ChapterThemeBackground;

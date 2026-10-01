import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, Compass, MapPin } from 'lucide-react';
import { FaceTimeMemory } from './FaceTimeMemory';
import { playHeartbeatSound } from '../utils/soundEffects';

/**
 * DistanceBridgeSection
 * Harta României și Puntea Cinematografică cu PUNCTUL COMUN DE ÎNTÂLNIRE LA ORADEA (CDTO 2026):
 * - Ștefan pornește din Piatra Neamț (Moldova)
 * - Cati pornește din Târgu Mureș (Transilvania)
 * - Amândoi călătoresc spre destinația comună: ORADEA (CDTO 2026)!
 * - Pe măsură ce tragi sliderul, amândoi înaintează pe hartă spre Oradea.
 * - La 0 km (100%), amândoi ajung simultan la Oradea, unde cele două poze se contopesc în POZA LOR ÎMPREUNĂ!
 */
export function DistanceBridgeSection({
  chapterData,
  isCompleted,
  onUnlockNextStage
}) {
  const [sliderVal, setSliderVal] = useState(0);
  const [hasMovedSlider, setHasMovedSlider] = useState(false);
  const [hasSentHeartbeat, setHasSentHeartbeat] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [heartbeatWave, setHeartbeatWave] = useState(false);

  const totalKm = chapterData?.totalDistanceKm || 220;
  const currentKm = Math.max(0, Math.round(totalKm * (1 - sliderVal / 100)));
  const isFullyConnected = sliderVal >= 98;

  // Coordonate precise pe harta României (viewBox 0 0 700 480)
  const PiatraNeamt = { x: 445, y: 155 };
  const TarguMures = { x: 315, y: 185 };
  const Oradea = { x: 115, y: 155 }; // Punctul comun de întâlnire
  const Suceava = { x: 425, y: 95 };

  // Interpolarea traseelor spre Oradea (curbe Bézier)
  const t = sliderVal / 100;

  // Traseul lui Ștefan: Piatra Neamț (445, 155) -> Oradea (115, 155) prin Pasul Carpaților
  const stefanControl = { x: 280, y: 115 };
  const stefanX = (1 - t) * (1 - t) * PiatraNeamt.x + 2 * (1 - t) * t * stefanControl.x + t * t * Oradea.x;
  const stefanY = (1 - t) * (1 - t) * PiatraNeamt.y + 2 * (1 - t) * t * stefanControl.y + t * t * Oradea.y;

  // Traseul lui Cati: Târgu Mureș (315, 185) -> Oradea (115, 155) prin Ardeal
  const catiControl = { x: 215, y: 175 };
  const catiX = (1 - t) * (1 - t) * TarguMures.x + 2 * (1 - t) * t * catiControl.x + t * t * Oradea.x;
  const catiY = (1 - t) * (1 - t) * TarguMures.y + 2 * (1 - t) * t * catiControl.y + t * t * Oradea.y;

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    if (!hasMovedSlider && val > 10) {
      setHasMovedSlider(true);
    }
  };

  const handleSendHeartbeat = () => {
    playHeartbeatSound();
    setHasSentHeartbeat(true);
    setHeartbeatWave(true);
    const newHeartId = Date.now();
    setFloatingHearts((prev) => [...prev, newHeartId]);

    setTimeout(() => {
      setHeartbeatWave(false);
    }, 1500);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((id) => id !== newHeartId));
    }, 1800);
  };

  const canProceed = hasMovedSlider && hasSentHeartbeat;

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 py-8">
      {/* Antet editorial pe card solid pentru contrast impecabil */}
      <div className="mb-8 mx-auto max-w-2xl rounded-3xl border border-rose-200/90 bg-[#FFFDF9] p-5 sm:p-8 text-center shadow-md">
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-rose-900/85 uppercase">
          {chapterData?.badge || "Capitolul 02 • Distanța, dar cu stil"}
        </span>
        <h3 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-4xl md:text-5xl">
          {chapterData?.title || "Ne vedem la Oradea?"}
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-lg font-light">
          {chapterData?.story || "El din Piatra Neamț, ea din Târgu Mureș. Matematic, la mijloc. Practic, Oradea, la CDTO 2026."}
        </p>
      </div>

      {/* ========================================================
          ANIMAȚIA CINEMATICĂ DE APROPIERE A POZELOR SPRE ORADEA
         ======================================================== */}
      <div className="relative my-8 overflow-hidden rounded-[2.5rem] border border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F2] to-[#F5ECE5] p-6 shadow-[0_20px_50px_-10px_rgba(40,25,30,0.08)] sm:p-10">
        
        {/* Titlu subtil al apropierii */}
        <div className="mb-6 flex items-center justify-center gap-2 text-sm sm:text-base font-serif italic text-rose-900/80">
          <MapPin className="h-4 w-4 text-amber-700" />
          <span>{chapterData?.sliderGuide || "Glisează și adu-ne mai aproape: Oradea 📍"}</span>
        </div>

        {/* Zona interactivă cu pozele animate */}
        <div className="relative flex min-h-[230px] sm:min-h-[270px] items-center justify-center py-4">
          
          <AnimatePresence mode="wait">
            {!isFullyConnected ? (
              /* Starea când sliderul este sub 98%: Două poze care se apropie spre centrul Oradea */
              <motion.div
                key="separate-photos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative flex w-full max-w-lg items-center justify-between px-2 sm:px-6"
              >
                {/* Poza lui Ștefan (Piatra Neamț -> Oradea) */}
                <motion.div
                  style={{ x: (sliderVal / 100) * 55 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="z-10 flex flex-col items-center shrink-0"
                >
                  <div className="relative h-20 w-20 sm:h-28 sm:w-28 overflow-hidden rounded-full border-3 sm:border-4 border-white shadow-[0_8px_20px_rgba(190,18,60,0.25)] ring-2 ring-rose-300">
                    <img
                      src="/photos/stefan.jpg"
                      alt="Ștefan pornind din Piatra Neamț"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="mt-2 font-serif text-xs font-semibold text-rose-950 sm:text-base">
                    Ștefan
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-ink-subtle font-light">
                    Piatra Neamț ➔ Oradea
                  </span>
                </motion.div>

                {/* Badge-ul central: Destinația comună Oradea & Kilometri rămași */}
                <div className="relative mx-1.5 sm:mx-2 flex flex-1 flex-col items-center justify-center z-0">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 rounded-full bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-amber-950 shadow-xs">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-700" />
                      <span>Oradea</span>
                    </div>
                    <span className="mt-1 text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-rose-900/60">
                      Punct de întâlnire
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="mt-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium text-rose-800 border border-rose-200 shadow-xs"
                    >
                      {currentKm} km
                    </motion.div>
                  </div>
                </div>

                {/* Poza lui Cati (Târgu Mureș -> Oradea) */}
                <motion.div
                  style={{ x: -(sliderVal / 100) * 55 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="z-10 flex flex-col items-center shrink-0"
                >
                  <div className="relative h-20 w-20 sm:h-28 sm:w-28 overflow-hidden rounded-full border-3 sm:border-4 border-white shadow-[0_8px_20px_rgba(217,119,6,0.25)] ring-2 ring-amber-300">
                    <img
                      src="/photos/cati.jpg"
                      alt="Cati pornind din Târgu Mureș"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="mt-2 font-serif text-xs font-semibold text-amber-950 sm:text-base">
                    Cati
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-ink-subtle font-light">
                    Târgu Mureș ➔ Oradea
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              /* Starea când sliderul atinge 100%: Amândoi au ajuns la ORADEA (Poza împreună) */
              <motion.div
                key="together-photo"
                initial={{ scale: 0.7, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Aureolă luminoasă aurie & rose */}
                <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-amber-300/40 via-rose-400/40 to-amber-300/40 blur-2xl animate-pulse" />

                {/* Rama foto romantică cu poza amândurora la Oradea */}
                <div className="relative h-40 w-40 sm:h-48 sm:w-48 overflow-hidden rounded-full border-4 border-white shadow-[0_15px_45px_rgba(190,18,60,0.45)] ring-4 ring-amber-400/80">
                  <img
                    src="/photos/impreuna.jpg"
                    alt="Cati și Ștefan împreună la Oradea"
                    className="h-full w-full object-cover object-center"
                  />
                  {/* Badge inimă peste poză */}
                  <div className="absolute bottom-1 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-md border-2 border-white">
                    <Heart className="h-4 w-4 fill-white" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950 border border-amber-300 mb-1.5">
                    <MapPin className="h-3 w-3 text-amber-700" />
                    <span>{chapterData?.commonMeetingPoint || "Oradea • loc de întâlnire"}</span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold tracking-tight text-rose-950 sm:text-3xl">
                    {chapterData?.connectedTitle || "Ne-am luat în brațe la Oradea 🥹"}
                  </h4>
                  <p className="mt-1 font-serif text-sm italic text-rose-800">
                    {chapterData?.connectedSubtitle || "CDTO 2026 • 1–4 septembrie • 0 kilometri"}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-ink-muted">
                    {chapterData?.connectedDescription || "Sute de kilometri, mii de „bună dimineața” pe telefon, și în sfârșit… la 0 km."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================
            HARTA VERITABILĂ A ROMÂNIEI CU CONVERGENȚĂ LA ORADEA
           ======================================================== */}
        <div className="mt-8 border-t border-rose-900/10 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 px-2 gap-2 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-rose-700" />
              <span className="font-serif italic font-medium">Harta României • Toate drumurile duc la Oradea</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-950 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              <span>Punct comun de întâlnire: Oradea (CDTO 2026)</span>
            </div>
          </div>

          <div className="relative my-4 w-full flex items-center justify-center">
            <svg
              viewBox="0 0 700 480"
              className="w-full h-auto max-h-[480px] overflow-visible select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="map-drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
                  <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2A1B22" floodOpacity="0.12" />
                </filter>

                <linearGradient id="romania-land-gradient" x1="100" y1="50" x2="600" y2="450">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="50%" stopColor="#FBF4EE" />
                  <stop offset="100%" stopColor="#F2E6DC" />
                </linearGradient>

                <linearGradient id="route-stefan-gradient" x1={PiatraNeamt.x} y1={PiatraNeamt.y} x2={Oradea.x} y2={Oradea.y}>
                  <stop offset="0%" stopColor="#BE123C" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                <linearGradient id="route-cati-gradient" x1={TarguMures.x} y1={TarguMures.y} x2={Oradea.x} y2={Oradea.y}>
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Măști circulare pentru decuparea pozelor pe hartă */}
                <clipPath id="avatar-clip-stefan">
                  <circle r="16" cx="0" cy="0" />
                </clipPath>
                <clipPath id="avatar-clip-cati">
                  <circle r="16" cx="0" cy="0" />
                </clipPath>
                <clipPath id="avatar-clip-oradea-together">
                  <circle r="26" cx="0" cy="0" />
                </clipPath>
              </defs>

              {/* CONTURUL CARTOGRAFIC AL ROMÂNIEI */}
              <path
                d="M 45 235 C 50 215, 65 185, 85 155 C 95 135, 105 110, 115 95 C 135 80, 150 75, 165 75 C 190 70, 210 62, 240 58 C 270 52, 310 50, 360 52 C 400 50, 430 45, 485 40 C 500 55, 515 90, 535 120 C 545 150, 550 170, 555 185 C 565 215, 570 235, 575 245 C 580 265, 585 280, 588 285 C 600 288, 630 295, 665 305 C 668 318, 665 328, 660 335 C 650 355, 640 365, 635 375 C 630 390, 626 400, 625 405 C 620 420, 618 430, 615 435 C 595 432, 580 430, 570 430 C 545 420, 530 412, 520 410 C 495 400, 480 395, 470 395 C 450 400, 435 402, 430 405 C 415 412, 405 418, 395 420 C 375 435, 360 445, 350 450 C 340 448, 335 446, 330 445 C 310 445, 300 445, 290 445 C 265 440, 245 430, 235 425 C 210 410, 195 400, 190 395 C 182 385, 178 380, 175 375 C 162 365, 155 358, 150 355 C 135 350, 125 346, 120 345 C 112 340, 108 336, 105 335 C 100 320, 96 310, 95 300 C 85 285, 75 272, 70 265 C 58 252, 48 242, 45 235 Z"
                fill="url(#romania-land-gradient)"
                stroke="#D8C5B6"
                strokeWidth="2.5"
                filter="url(#map-drop-shadow)"
              />

              {/* ARCUL CARPAȚILOR */}
              <path
                d="M 330 65 Q 365 125 385 180 Q 380 235 335 270 Q 255 280 175 350"
                stroke="#D8C3B3"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="3 7"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M 335 270 L 375 255"
                stroke="#D8C3B3"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="2 6"
                fill="none"
                opacity="0.7"
              />

              {/* Regiuni istorice */}
              <text x="500" y="210" className="font-serif italic text-[11px] fill-stone-400 select-none">Moldova</text>
              <text x="240" y="210" className="font-serif italic text-[11px] fill-stone-400 select-none">Transilvania</text>
              <text x="75" y="210" className="font-serif italic text-[10px] fill-stone-400 select-none">Crișana</text>
              <text x="320" y="360" className="font-serif italic text-[11px] fill-stone-400 select-none">Muntenia</text>

              {/* Traseu Suceava (Olimpiada) -> Piatra Neamț */}
              <path
                d={`M ${Suceava.x} ${Suceava.y} L ${PiatraNeamt.x} ${PiatraNeamt.y}`}
                stroke="#BE123C"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.4"
              />

              {/* Conexiune inițială Piatra Neamț ↔ Târgu Mureș */}
              <path
                d={`M ${PiatraNeamt.x} ${PiatraNeamt.y} Q 380 160 ${TarguMures.x} ${TarguMures.y}`}
                stroke="#E2D0C2"
                strokeWidth="2"
                strokeDasharray="3 4"
                fill="none"
                opacity="0.5"
              />

              {/* ========================================================
                  TRASEUL LUI ȘTEFAN SPRE ORADEA (PIATRA NEAMȚ ➔ ORADEA)
                 ======================================================== */}
              <path
                d={`M ${PiatraNeamt.x} ${PiatraNeamt.y} Q ${stefanControl.x} ${stefanControl.y} ${Oradea.x} ${Oradea.y}`}
                stroke="#E8D7CA"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d={`M ${PiatraNeamt.x} ${PiatraNeamt.y} Q ${stefanControl.x} ${stefanControl.y} ${Oradea.x} ${Oradea.y}`}
                stroke="url(#route-stefan-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="340"
                strokeDashoffset={340 - (sliderVal / 100) * 340}
                fill="none"
              />

              {/* ========================================================
                  TRASEUL LUI CATI SPRE ORADEA (TÂRGU MUREȘ ➔ ORADEA)
                 ======================================================== */}
              <path
                d={`M ${TarguMures.x} ${TarguMures.y} Q ${catiControl.x} ${catiControl.y} ${Oradea.x} ${Oradea.y}`}
                stroke="#E8D7CA"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d={`M ${TarguMures.x} ${TarguMures.y} Q ${catiControl.x} ${catiControl.y} ${Oradea.x} ${Oradea.y}`}
                stroke="url(#route-cati-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="210"
                strokeDashoffset={210 - (sliderVal / 100) * 210}
                fill="none"
              />

              {/* Valul bătăii de inimă simultan spre Oradea */}
              {heartbeatWave && (
                <>
                  <motion.circle
                    r="8"
                    fill="#BE123C"
                    initial={{ cx: PiatraNeamt.x, cy: PiatraNeamt.y, opacity: 1 }}
                    animate={{ cx: Oradea.x, cy: Oradea.y, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="shadow-[0_0_15px_#be123c]"
                  />
                  <motion.circle
                    r="8"
                    fill="#D97706"
                    initial={{ cx: TarguMures.x, cy: TarguMures.y, opacity: 1 }}
                    animate={{ cx: Oradea.x, cy: Oradea.y, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="shadow-[0_0_15px_#d97706]"
                  />
                </>
              )}

              {/* CĂLĂTORII MOBILI PE HARTĂ SPRE ORADEA */}
              {!isFullyConnected && (
                <>
                  {/* Ștefan călătorind */}
                  <g transform={`translate(${stefanX}, ${stefanY})`}>
                    <circle r="7" fill="#BE123C" stroke="#FFFFFF" strokeWidth="2" className="shadow-[0_0_10px_#be123c]" />
                  </g>
                  {/* Cati călătorind */}
                  <g transform={`translate(${catiX}, ${catiY})`}>
                    <circle r="7" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" className="shadow-[0_0_10px_#d97706]" />
                  </g>
                </>
              )}

              {/* Suceava (Olimpiada) */}
              <g transform={`translate(${Suceava.x}, ${Suceava.y})`}>
                <circle r="4" fill="#881337" opacity="0.8" />
                <text x="8" y="4" className="font-serif text-[11px] font-medium fill-[#4A0A1C]">
                  Suceava <tspan className="text-[9px] fill-stone-500 font-sans font-normal">(28 mar)</tspan>
                </text>
              </g>

              {/* Piatra Neamț — cu poza reală a lui Ștefan decupată circular */}
              <g transform={`translate(${PiatraNeamt.x}, ${PiatraNeamt.y})`}>
                <circle r="18" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2.5" />
                <image
                  href="/photos/stefan.jpg"
                  x="-16"
                  y="-16"
                  width="32"
                  height="32"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#avatar-clip-stefan)"
                />
                <text x="24" y="5" className="font-serif text-[13px] font-bold fill-[#1C1215]">
                  Piatra Neamț <tspan className="text-[10px] font-sans font-normal fill-rose-800">(Ștefan)</tspan>
                </text>
              </g>

              {/* Târgu Mureș — cu poza reală a lui Cati decupată circular */}
              <g transform={`translate(${TarguMures.x}, ${TarguMures.y})`}>
                <circle r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
                <image
                  href="/photos/cati.jpg"
                  x="-16"
                  y="-16"
                  width="32"
                  height="32"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#avatar-clip-cati)"
                />
                <text x="-24" y="24" textAnchor="end" className="font-serif text-[13px] font-bold fill-[#1C1215]">
                  <tspan className="text-[10px] font-sans font-normal fill-amber-800">(Cati)</tspan> Târgu Mureș
                </text>
              </g>

              {/* ========================================================
                  ORADEA: PUNCTUL COMUN DE ÎNTÂLNIRE (CDTO 2026)
                 ======================================================== */}
              <g transform={`translate(${Oradea.x}, ${Oradea.y})`}>
                {/* Aureolă țintă animată */}
                <circle r="14" fill="#FDE68A" opacity="0.5" className="animate-ping" />
                <circle r="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-md" />
                <circle r="4" fill="#78350F" />

                {/* Banner destinație */}
                <g transform="translate(0, -22)">
                  <rect x="-65" y="-12" width="130" height="22" rx="11" fill="#78350F" opacity="0.95" />
                  <text x="0" y="3" textAnchor="middle" className="font-serif text-[11px] font-bold fill-amber-100 tracking-wide">
                    ★ ORADEA • CDTO ★
                  </text>
                </g>
                <text x="0" y="26" textAnchor="middle" className="text-[9px] font-bold fill-amber-950 font-sans">
                  Punctul comun de întâlnire
                </text>
                <text x="0" y="37" textAnchor="middle" className="text-[8.5px] fill-stone-500 font-sans">
                  (1–4 septembrie)
                </text>
              </g>

              {/* POZA ÎMPREUNĂ UNITĂ LA ORADEA LA 0 KM */}
              {isFullyConnected && (
                <g transform={`translate(${Oradea.x}, ${Oradea.y})`}>
                  <circle r="34" fill="#F59E0B" opacity="0.4" className="animate-pulse" />
                  <circle r="29" fill="#BE123C" className="shadow-[0_0_35px_rgba(225,29,72,0.9)]" />
                  <image
                    href="/photos/impreuna.jpg"
                    x="-26"
                    y="-26"
                    width="52"
                    height="52"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#avatar-clip-oradea-together)"
                  />
                  <circle r="27" fill="none" stroke="#FFFFFF" strokeWidth="3" />
                  {/* Inimă peste avatar */}
                  <circle cx="18" cy="18" r="9" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
                  <path
                    d="M 18 22 C 18 22, 14 19, 14 17 C 14 15.5, 15.5 14.5, 17 15.5 C 18 16.5, 18 16.5, 18 16.5 C 18 16.5, 18 16.5, 19 15.5 C 20.5 14.5, 22 15.5, 22 17 C 22 19, 18 22, 18 22 Z"
                    fill="#FFFFFF"
                    transform="scale(0.8) translate(4.5, 4.5)"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* CONTROL SLIDER */}
        <div className="my-8 px-2 sm:px-10">
          <div className="mb-2.5 flex flex-col sm:flex-row justify-between text-sm sm:text-base text-ink-muted gap-1">
            <span className="font-mono text-xs sm:text-sm">
              Plecarea (Piatra Neamț & Târgu Mureș)
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-amber-900">
              0 km • Întâlnirea la Oradea (CDTO 2026)
            </span>
          </div>
          <label htmlFor="distance-slider" className="sr-only">
            Apropie distanța spre punctul comun de întâlnire de la Oradea
          </label>
          <input
            id="distance-slider"
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-rose-100/80 accent-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          />
          <p className="mt-3 text-center text-sm sm:text-base text-ink-subtle font-light">
            Glisează pentru a vedea cum amândoi călătoresc pe harta României spre punctul comun de întâlnire din Oradea
          </p>
        </div>

        {/* BUTON BĂTAIE DE INIMĂ */}
        <div className="relative mt-9 flex flex-col items-center justify-center border-t border-rose-900/10 pt-7">
          <button
            type="button"
            onClick={handleSendHeartbeat}
            className="group relative flex min-h-[54px] items-center gap-3 rounded-full border border-amber-300/80 bg-gradient-to-b from-white to-amber-50/70 px-8 py-3.5 text-base sm:text-lg font-medium text-rose-950 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:outline-none cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              <Heart className="h-5 w-5 fill-rose-600 text-rose-600" />
            </motion.div>
            <span>{chapterData?.heartbeatButtonText || "Trimite o bătaie de inimă spre Oradea 💌"}</span>
          </button>

          {/* Animație plutire inimă discretă */}
          <div className="pointer-events-none absolute -top-8 flex items-center justify-center">
            {floatingHearts.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -70, scale: 1.5 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute text-rose-600"
              >
                <Heart className="h-7 w-7 fill-rose-600" />
              </motion.div>
            ))}
          </div>

          <span className="mt-3 text-xs sm:text-sm text-ink-subtle font-medium">
            {hasSentHeartbeat
              ? (chapterData?.heartbeatPressed || "Inimile noastre s-au întâlnit la Oradea ❤️")
              : (chapterData?.heartbeatUnpressed || "Apasă ca să trimiți un puls din ambele orașe")}
          </span>
        </div>
      </div>

      {/* CARDUL NOCTURN FACETIME (DACĂ ESTE CONFIGURAT PENTRU CAPITOL) */}
      {chapterData?.facetimeMemory && (
        <div className="mt-12">
          <FaceTimeMemory memory={chapterData.facetimeMemory} />
        </div>
      )}

      {/* BUTON DEBLOCARE ETAPA URMĂTOARE */}
      <div className="mt-10 mx-auto max-w-xl flex flex-col items-center gap-3 rounded-3xl border border-rose-200/90 bg-[#FFFDF9] p-5 sm:p-7 shadow-lg">
        {(canProceed || isCompleted) && (
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic text-rose-900/90 font-medium max-w-md text-center">
            <Heart className="h-4 w-4 fill-rose-600 text-rose-600 shrink-0" />
            <span>
              {chapterData?.activeAdvancePrompt || "Inimile s-au adunat! Hai spre Oradea."}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onUnlockNextStage}
          disabled={!canProceed && !isCompleted}
          className={`group flex min-h-[56px] items-center gap-3 rounded-full px-9 py-4 text-base sm:text-lg font-medium tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none ${
            canProceed || isCompleted
              ? 'bg-gradient-to-r from-rose-800 to-rose-950 text-white shadow-md hover:scale-[1.02] hover:shadow-lg cursor-pointer'
              : 'cursor-not-allowed bg-stone-100 text-stone-400 border border-stone-200'
          }`}
        >
          <span>{chapterData?.nextButtonText || "Hai la Oradea ➜"}</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {!canProceed && !isCompleted && (
          <div className="max-w-md text-center mt-1">
            <p className="text-xs sm:text-sm text-ink-subtle font-light">
              {chapterData?.blockedAdvancePrompt || "Trage sliderul la 0 km și trimite o bătaie de inimă, altfel nu pornim 😌"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DistanceBridgeSection;

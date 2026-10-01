import React from 'react';

/**
 * AmbientLights
 * Atmosferă cinematică intimă:
 * Folosește un filtru SVG de granulație fină de hârtie/peliculă (elimină complet aspectul plat de AI slop)
 * și tranziții dramatice de lumină ambientală caldă inspirate din lumina naturală a soarelui și a nopții.
 */
export function AmbientLights({ stage = 0 }) {
  // Configurare atmosferă pe etape:
  // 0: Seif misterios (lumini calde de lumânare / amber & sepia)
  // 1: Suceava primăvară (ivoriu, trandafiriu cald, lumină de zi filtrată)
  // 2: Puntea de noapte (amurg spre noapte înstelată pe munți)
  // 3: Zori de zi septembrie (trecere spectaculoasă de la indigo profund la auroră roz-aurie)
  // 4: Oficial Noi (lumină aurie, rose șampanie, intimitate deplină)

  const isNight = stage === 2 || stage === 3;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-all duration-1000"
    >
      {/* Filtru SVG de textură organică de hârtie / granulație cinematică */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-color-burn">
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Lumina 1: Fascicul cald de lumină superioară */}
      <div
        className={`ambient-light-1 absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full blur-[140px] transition-all duration-1000 ${
          stage === 3
            ? 'bg-gradient-to-b from-amber-200/40 via-rose-300/30 to-transparent'
            : isNight
            ? 'bg-indigo-950/30'
            : 'bg-gradient-to-b from-[#FEF3C7]/70 via-[#FFE4E6]/40 to-transparent'
        }`}
      />

      {/* Lumina 2: Respirație laterală stânga */}
      <div
        className={`ambient-light-2 absolute top-1/4 -left-48 h-[600px] w-[600px] rounded-full blur-[160px] transition-all duration-1000 ${
          isNight
            ? 'bg-purple-950/20'
            : 'bg-[#FECDD3]/35'
        }`}
      />

      {/* Lumina 3: Respirație laterală dreapta (Warm Amber / Rose Champagne) */}
      <div
        className={`ambient-light-3 absolute top-1/2 -right-48 h-[650px] w-[650px] rounded-full blur-[160px] transition-all duration-1000 ${
          isNight
            ? 'bg-rose-950/25'
            : 'bg-[#FEF3C7]/45'
        }`}
      />

      {/* Vignetă cinematică fină pe margini pentru adâncime de câmp */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(28,18,21,0.04)_100%)]" />
    </div>
  );
}

export default AmbientLights;

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Disc3, Volume2, VolumeX } from 'lucide-react';

/**
 * TurntablePlayer
 * Buton flotant cu design de disc de vinil vintage.
 * Nu pornește niciodată automat (fără autoplay).
 * Verifică fișierul local `/piesa-noastra.mp3`; dacă nu există, activează un fundal
 * sonor cald și minimalist sintetizat procedural prin Web Audio API (acorduri discrete).
 */
export function TurntablePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [useProcedural, setUseProcedural] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);

  // Inițializează sau oprește sinteza Web Audio procedurală
  const startProceduralAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain pentru un volum discret și cald
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);

      // Filtru trece-jos cald (Low-pass la 450Hz) pentru senzație intimă de vinil
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Note calde, armonioase în acord major relaxant (F3, A3, C4, E4)
      const frequencies = [174.61, 220.0, 261.63, 329.63];

      oscillatorsRef.current = frequencies.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // LFO foarte subtil pentru mișcare organică
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        return osc;
      });
    } catch {
      // Fail-safe silențios
    }
  };

  const stopProceduralAudio = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          gainNodeRef.current.gain.value,
          audioContextRef.current.currentTime
        );
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContextRef.current.currentTime + 1.2
        );
      }

      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // deja oprit
          }
        });
        oscillatorsRef.current = [];
      }, 1200);
    } catch {
      // silențios
    }
  };

  // Toggle Redare / Pauză
  const togglePlay = () => {
    if (!hasUserStarted) {
      setHasUserStarted(true);
    }

    if (isPlaying) {
      // Pauză
      setIsPlaying(false);
      if (audioRef.current && !useProcedural) {
        audioRef.current.pause();
      } else {
        stopProceduralAudio();
      }
    } else {
      // Pornire audio la acțiunea utilizatoarei
      setIsPlaying(true);

      if (audioRef.current && !useProcedural) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Dacă fișierul mp3 lipsește sau e blocat, trecem pe Web Audio procedural
            setUseProcedural(true);
            startProceduralAudio();
          });
        }
      } else {
        startProceduralAudio();
      }
    }
  };

  // Curățare la demontare
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopProceduralAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed right-5 bottom-6 z-40 flex items-center gap-3">
      {/* Element audio ascuns pentru fișier local opțional */}
      <audio
        ref={audioRef}
        src="/piesa-noastra.mp3"
        loop
        preload="none"
        onError={() => {
          setUseProcedural(true);
        }}
      />

      {/* Buton flotant vinil */}
      <div className="group relative flex items-center">
        {/* Tooltip pe hover/focus */}
        <span className="pointer-events-none absolute right-16 hidden rounded-lg border border-rose-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-rose-950 shadow-md whitespace-nowrap sm:block group-hover:block transition-opacity">
          {isPlaying ? "Merge muzica (pauză)" : "Muzica noastră (dă drumul la vinil 🎶)"}
        </span>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={
            isPlaying
              ? "Merge muzica (pauză)"
              : "Muzica noastră (dă drumul la vinil 🎶)"
          }
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-200/90 bg-[#120F12] text-amber-100 shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/50"
        >
          {/* Corpul discului de vinil cu striații */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: 'linear'
            }}
            className="absolute inset-1 flex items-center justify-center rounded-full border border-stone-800 bg-[radial-gradient(#292329_1px,transparent_1px)] [background-size:6px_6px]"
          >
            {/* Caneluri circulare */}
            <div className="absolute inset-2 rounded-full border border-stone-700/60" />
            <div className="absolute inset-4 rounded-full border border-stone-700/40" />

            {/* Eticheta centrală de vinil */}
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-700 to-rose-900 shadow-inner">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-100" />
            </div>
          </motion.div>

          {/* Indicator vizual de stare peste vinil */}
          <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-800 shadow-sm">
            {isPlaying ? (
              <Volume2 className="h-3 w-3" />
            ) : (
              <VolumeX className="h-3 w-3 text-stone-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default TurntablePlayer;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Heart, Sparkles, MapPin } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

const milestones = [
  {
    id: 'suceava',
    title: 'Prima privire',
    subtitle: 'Suceava • 28 martie 2026',
    dateStr: '28 mar',
    targetDate: '2026-03-28T12:00:00',
    tag: 'Suceava'
  },
  {
    id: 'oradea',
    title: 'Primul sărut',
    subtitle: 'Oradea • 4 septembrie 2026',
    dateStr: '4 sep',
    targetDate: '2026-09-04T05:00:00',
    tag: 'Oradea'
  },
  {
    id: 'official',
    title: 'Oficial «Noi»',
    subtitle: '19 septembrie 2026',
    dateStr: '19 sep',
    targetDate: '2026-09-19T12:00:00',
    tag: 'Noi'
  }
];

/**
 * LoveCounter
 * Cronometru multi-milestone al iubirii noastre:
 * Permite comutarea între cele 3 repere istorice:
 * 1. 28 Martie 2026 (Suceava)
 * 2. 4 Septembrie 2026 (Oradea • CDTO 2026)
 * 3. 19 Septembrie 2026 (Oficial «Noi»)
 */
export function LoveCounter() {
  const [activeMilestoneId, setActiveMilestoneId] = useState('suceava');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeMilestone = milestones.find((m) => m.id === activeMilestoneId) || milestones[0];

  const calculateTime = (targetIso) => {
    const target = new Date(targetIso);
    let diff = now.getTime() - target.getTime();

    // Dacă data e în viitor, calculăm timpul rămas / invers
    const isPast = diff >= 0;
    diff = Math.abs(diff);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast };
  };

  const activeTime = calculateTime(activeMilestone.targetDate);

  const handleTabChange = (id) => {
    if (id !== activeMilestoneId) {
      playCardFlipSound();
      setActiveMilestoneId(id);
    }
  };

  return (
    <div
      aria-label="Contorul timpului scurs al iubirii noastre"
      className="relative mx-auto my-14 w-full max-w-2xl px-4 text-center"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-900/10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F2] to-[#F5ECE5] p-6 shadow-[0_20px_50px_-10px_rgba(40,25,30,0.08)] sm:p-10">
        
        {/* Selector de repere (Tabs) */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
          {milestones.map((m) => {
            const isActive = m.id === activeMilestoneId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleTabChange(m.id)}
                className={`relative flex min-h-[44px] items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer ${
                  isActive
                    ? 'bg-rose-900 text-white shadow-sm'
                    : 'border border-rose-900/15 bg-white/70 text-ink-muted hover:bg-rose-50/80 hover:text-ink'
                }`}
              >
                <span>{m.title}</span>
                <span className={`text-xs ${isActive ? 'text-amber-200' : 'text-rose-800/60'}`}>
                  {m.dateStr}
                </span>
              </button>
            );
          })}
        </div>

        {/* Titlu & descriere reper activ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="my-4"
          >
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-widest text-rose-800 uppercase">
              <Clock className="h-4 w-4 text-rose-600" />
              <span>{activeMilestone.subtitle}</span>
            </div>

            <h4 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-4xl">
              {activeMilestone.title}
            </h4>
          </motion.div>
        </AnimatePresence>

        {/* Cifre stilizate cu secundar pulsant */}
        <div className="my-8 grid grid-cols-4 gap-3 sm:gap-5">
          <div className="flex flex-col items-center rounded-2xl border border-rose-900/10 bg-white/95 p-3.5 sm:p-5 shadow-xs">
            <span className="font-mono text-3xl sm:text-5xl font-light text-rose-950">
              {activeTime.days}
            </span>
            <span className="mt-1 text-xs text-ink-subtle uppercase tracking-wider font-semibold">
              zile
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-rose-900/10 bg-white/95 p-3.5 sm:p-5 shadow-xs">
            <span className="font-mono text-3xl sm:text-5xl font-light text-rose-950">
              {activeTime.hours}
            </span>
            <span className="mt-1 text-xs text-ink-subtle uppercase tracking-wider font-semibold">
              ore
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-rose-900/10 bg-white/95 p-3.5 sm:p-5 shadow-xs">
            <span className="font-mono text-3xl sm:text-5xl font-light text-rose-950">
              {activeTime.minutes}
            </span>
            <span className="mt-1 text-xs text-ink-subtle uppercase tracking-wider font-semibold">
              minute
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-rose-900/10 bg-white/95 p-3.5 sm:p-5 shadow-xs">
            <motion.span
              key={activeTime.seconds}
              initial={{ scale: 1.15, color: '#BE123C' }}
              animate={{ scale: 1, color: '#9F1239' }}
              transition={{ duration: 0.3 }}
              className="font-mono text-3xl sm:text-5xl font-light"
            >
              {activeTime.seconds}
            </motion.span>
            <span className="mt-1 text-xs text-ink-subtle uppercase tracking-wider font-semibold">
              secunde
            </span>
          </div>
        </div>

        {/* Notă fină de subsol */}
        <p className="mt-5 flex items-center justify-center gap-2 font-serif text-base sm:text-lg italic text-ink-muted">
          <span>„Timpul contează doar când îl măsor cu tine ❤️”</span>
        </p>
      </div>
    </div>
  );
}

export default LoveCounter;

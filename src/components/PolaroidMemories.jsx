import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Compass, Coffee, Award, X } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

const keepsakeItems = [
  {
    id: 'suceava-olimpiada',
    image: '/photos/olimpiada-suceava.jpg',
    imageFit: 'object-contain bg-white p-1.5',
    imagePosition: 'object-center',
    title: 'Privirea din Suceava',
    date: '28 martie 2026 • Suceava',
    tag: 'Suceava',
    rotation: '-rotate-2',
    snippet: 'Hotel Continental, Suceava',
    fullThought: 'Când te-am văzut, ai stârnit o sclipire și ai dat o scânteie în ochii mei.'
  },
  {
    id: 'cati-tgmures',
    image: '/photos/cati.jpg',
    imagePosition: 'object-center',
    title: 'Zâmbetul peste kilometri',
    date: 'Primăvara–vara 2026 • Târgu Mureș',
    tag: 'Târgu Mureș',
    rotation: 'rotate-1',
    snippet: 'Piatra Neamț ↔ Târgu Mureș (220 km)',
    fullThought: 'Zâmbetul tău pe ecran a făcut 220 km să pară 2 pași.'
  },
  {
    id: 'impreuna-oradea',
    image: '/photos/dimineata-oradea.jpg',
    imagePosition: 'object-center',
    title: 'Dimineața de la Oradea',
    date: '4 septembrie 2026 • CDTO',
    tag: 'CDTO',
    rotation: '-rotate-1',
    snippet: '03:00 → 09:00',
    fullThought: 'De la 3 la 9, timpul a stat. Ne vedem curând, promit.'
  }
];

/**
 * PolaroidMemories
 * O colecție de 3 „amintiri păstrate în buzunar” cu design tactil de polaroid / hârtie vintage.
 * Se pot inspecta prin tap/click pentru a citi notele intime de mână.
 */
export function PolaroidMemories() {
  const [selectedKeepsake, setSelectedKeepsake] = useState(null);

  const handleSelect = (item) => {
    playCardFlipSound();
    setSelectedKeepsake(item);
  };

  return (
    <div className="relative mx-auto my-12 w-full max-w-4xl px-4 text-center">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-sm font-semibold text-rose-800 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-rose-600" />
          Amintiri în buzunar
        </span>
        <h3 className="mt-3 font-serif text-3xl font-medium text-ink sm:text-4xl">
          Detalii mici, efecte mari
        </h3>
        <p className="mt-2 text-sm text-ink-subtle">
          Atinge un polaroid ca să-l întorci.
        </p>
      </div>

      {/* Rândul de carduri Polaroid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {keepsakeItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(item);
              }
            }}
            className={`group relative cursor-pointer rounded-2xl border border-stone-200/90 bg-[#FFFDFB] p-5 text-left shadow-md transition-shadow duration-300 hover:shadow-soft-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${item.rotation}`}
          >
            {/* Bandă adezivă decorativă (Washi Tape) */}
            <div className="absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 rounded-xs bg-rose-100/90 opacity-80 backdrop-blur-xs border border-rose-200/40 shadow-xs z-10" />

            {/* Fereastra foto Polaroid cu poză reală */}
            <div className="relative mb-3 h-52 w-full overflow-hidden rounded-xl bg-white border border-stone-200/80 shadow-inner">
              <img
                src={item.image}
                alt={item.title}
                className={`h-full w-full ${item.imageFit || 'object-cover'} ${item.imagePosition} transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rose-900 tracking-wider shadow-xs backdrop-blur-xs">
                {item.tag}
              </span>
            </div>

            {/* Text Polaroid */}
            <h4 className="font-serif text-xl sm:text-2xl font-medium text-ink group-hover:text-rose-900 transition-colors">
              {item.title}
            </h4>
            <p className="mt-1 text-xs font-semibold text-rose-800/90">
              {item.date}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-2">
              {item.snippet}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-rose-100/80 pt-2.5 text-xs text-rose-700 font-semibold">
              <span>Întoarce polaroidul 👀</span>
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal / Dialog detaliat pentru amintirea selectată */}
      <AnimatePresence>
        {selectedKeepsake && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedKeepsake.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKeepsake(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-rose-200 bg-[#FFF9F6] p-6 text-left shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedKeepsake(null)}
                aria-label="Închide detaliul"
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-stone-500 hover:bg-rose-100 hover:text-stone-900 transition-colors focus-visible:outline-none shadow-xs"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Imaginea mărită în modal */}
              <div className="relative mb-5 h-64 sm:h-72 w-full overflow-hidden rounded-xl border border-rose-200/90 shadow-sm bg-white">
                <img
                  src={selectedKeepsake.image}
                  alt={selectedKeepsake.title}
                  className={`h-full w-full ${selectedKeepsake.imageFit || 'object-cover'} ${selectedKeepsake.imagePosition}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-rose-950 shadow-sm">
                  {selectedKeepsake.tag}
                </span>
              </div>

              <span className="text-xs font-bold tracking-wider text-rose-800 uppercase">
                {selectedKeepsake.date}
              </span>
              <h4 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-ink">
                {selectedKeepsake.title}
              </h4>

              <div className="my-5 rounded-xl border border-rose-200/80 bg-white/95 p-6 shadow-inner">
                <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-[#2C2126]">
                  „{selectedKeepsake.fullThought}”
                </p>
                <span className="mt-3 block text-right font-serif text-sm text-rose-800 font-semibold">
                  — Cu drag, Ștefan
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedKeepsake(null)}
                  className="rounded-full bg-rose-100 border border-rose-200 px-6 py-2.5 text-sm font-semibold text-rose-900 hover:bg-rose-200 transition-colors focus-visible:outline-none cursor-pointer"
                >
                  Păstrează în inimă
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PolaroidMemories;

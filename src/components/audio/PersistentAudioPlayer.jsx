import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, X, Disc } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioContext';

export default function PersistentAudioPlayer() {
  const {
    currentReciter,
    currentSurahNum,
    currentSurahName,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isPlayerVisible,
    setIsPlayerVisible,
    togglePlay,
    seek,
    changeVolume,
    changeSpeed,
    playNext,
    playPrev,
  } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isPlayerVisible) return null;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-16 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[450px] z-50 bg-white/95 dark:bg-wesal-dark-card/95 rounded-3xl p-4 shadow-2xl border-2 border-emerald-600/30 dark:border-gold-400/30 text-slate-900 dark:text-slate-100 backdrop-blur-2xl"
      >
        {/* Compact Player View */}
        <div className="flex items-center justify-between gap-3">
          {/* Reciter Avatar & Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-emerald-300 dark:border-gold-400/30 shrink-0 bg-emerald-950">
              <img
                src={currentReciter.image}
                alt={currentReciter.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/logo 2.png'; }}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Disc className="w-6 h-6 text-gold-400 animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-emerald-800 dark:text-gold-400 truncate">{currentSurahName}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 truncate">{currentReciter.name}</p>
            </div>
          </div>

          {/* Quick Play Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={playPrev}
              className="p-2 text-slate-500 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
              title="السورة السابقة"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-emerald-700 dark:bg-gradient-to-r dark:from-gold-400 dark:to-amber-500 text-white dark:text-serenity-bg font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current mr-0.5" />}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-slate-500 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-gold-400 transition-colors"
              title="السورة التالية"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsPlayerVisible(false)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-gold-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Expanded Controls Panel */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-4"
          >
            {/* Speed selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">سرعة التشغيل:</span>
              <div className="flex gap-1.5">
                {[1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changeSpeed(rate)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      playbackRate === rate
                        ? 'bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeVolume(volume === 0 ? 1 : 0)}
                className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-gold-400"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-gold-400"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

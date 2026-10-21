import React, { useState } from 'react';
import { Headphones, Play, Pause, Disc, User, Music, Search } from 'lucide-react';
import { RECITERS_LIST } from '../../services/reciterService';
import { useAudioPlayer } from '../../context/AudioContext';

const SURAH_NAMES = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس"
];

export default function AudioPage() {
  const { currentReciter, setCurrentReciter, currentSurahNum, isPlaying, playSurah, togglePlay } = useAudioPlayer();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = SURAH_NAMES.map((name, idx) => ({
    num: idx + 1,
    name: name,
  })).filter(s => s.name.includes(searchTerm) || s.num.toString() === searchTerm);

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-gold-400 font-heading flex items-center gap-3">
          <Headphones className="w-8 h-8 text-emerald-600 dark:text-amber-400" />
          <span>مشغل القارئ والاستماع</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          اختر القارئ المفضل لديك واستمع إلى سور القرآن الكريم بصوت نقي بجودة عالية.
        </p>
      </div>

      {/* 1. Reciter Selection Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600 dark:text-gold-400" />
          <span>اختر القارئ</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {RECITERS_LIST.map((reciter) => {
            const isSelected = currentReciter.id === reciter.id;

            return (
              <div
                key={reciter.id}
                onClick={() => setCurrentReciter(reciter)}
                className={`wesal-card p-4 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center space-y-3 ${
                  isSelected
                    ? 'border-2 border-emerald-600 dark:border-gold-400 bg-emerald-50 dark:bg-gold-400/10 shadow-md scale-105'
                    : 'hover:border-emerald-600/40 dark:hover:border-gold-400/40'
                }`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-200 dark:border-gold-400/30 bg-emerald-950 shadow-md">
                  <img
                    src={reciter.image}
                    alt={reciter.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/logo 2.png'; }}
                  />
                  {isSelected && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Disc className="w-8 h-8 text-gold-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 transition-colors">
                    {reciter.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{reciter.rewaya}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Surah Audio List for Current Reciter */}
      <div className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading flex items-center gap-2">
            <Music className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>قائمة السور — {currentReciter.name}</span>
          </h2>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن سورة..."
              className="w-full bg-white dark:bg-wesal-dark-card border border-slate-300 dark:border-emerald-500/20 rounded-2xl py-2.5 pr-10 pl-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-gold-400 shadow-sm"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-gold-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => {
            const isCurrentTrack = currentSurahNum === surah.num;

            return (
              <div
                key={surah.num}
                onClick={() => {
                  if (isCurrentTrack) {
                    togglePlay();
                  } else {
                    playSurah(surah.num, `سورة ${surah.name}`, currentReciter);
                  }
                }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-4 ${
                  isCurrentTrack
                    ? 'bg-emerald-50 dark:bg-emerald-900/60 border-emerald-600 dark:border-gold-400 text-emerald-800 dark:text-gold-400 shadow-md font-bold'
                    : 'wesal-card hover:border-emerald-600/40 dark:hover:border-gold-400/40 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-gold-400/30 flex items-center justify-center font-mono font-bold text-xs">
                    {surah.num}
                  </div>
                  <span className="font-bold text-base">سورة {surah.name}</span>
                </div>

                <div
                  className={`p-2.5 rounded-full ${
                    isCurrentTrack
                      ? 'bg-emerald-700 dark:bg-gold-400 text-white dark:text-serenity-bg font-bold'
                      : 'bg-slate-100 dark:bg-emerald-950 text-emerald-700 dark:text-gold-400 hover:scale-105'
                  }`}
                >
                  {isCurrentTrack && isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current mr-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

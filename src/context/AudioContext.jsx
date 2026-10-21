import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { RECITERS_LIST, getSurahAudioUrl } from '../services/reciterService';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentReciter, setCurrentReciter] = useState(RECITERS_LIST[0]);
  const [currentSurahNum, setCurrentSurahNum] = useState(1);
  const [currentSurahName, setCurrentSurahName] = useState('الفاتحة');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next surah if within bounds
      if (currentSurahNum < 114) {
        playSurah(currentSurahNum + 1, `سورة ${currentSurahNum + 1}`, currentReciter);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSurahNum, currentReciter]);

  const playSurah = (surahNum, surahName, reciter = currentReciter) => {
    const audio = audioRef.current;
    const url = getSurahAudioUrl(reciter.server, surahNum);

    setCurrentSurahNum(surahNum);
    setCurrentSurahName(surahName || `سورة ${surahNum}`);
    setCurrentReciter(reciter);
    setIsPlayerVisible(true);

    audio.src = url;
    audio.playbackRate = playbackRate;
    audio.volume = volume;

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error('Audio play error:', err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (val) => {
    const audio = audioRef.current;
    audio.volume = val;
    setVolume(val);
  };

  const changeSpeed = (rate) => {
    const audio = audioRef.current;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const playNext = () => {
    if (currentSurahNum < 114) {
      playSurah(currentSurahNum + 1, `سورة ${currentSurahNum + 1}`, currentReciter);
    }
  };

  const playPrev = () => {
    if (currentSurahNum > 1) {
      playSurah(currentSurahNum - 1, `سورة ${currentSurahNum - 1}`, currentReciter);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentReciter,
        setCurrentReciter,
        currentSurahNum,
        currentSurahName,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        isPlayerVisible,
        setIsPlayerVisible,
        playSurah,
        togglePlay,
        seek,
        changeVolume,
        changeSpeed,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioContext);

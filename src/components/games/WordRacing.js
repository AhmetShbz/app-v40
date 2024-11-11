import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Star,
  Trophy,
  Heart,
  Flame,
  ArrowLeft,
  RefreshCw,
  Volume2,
  VolumeX,
  Music,
  Crown,
  Zap,
  Settings,
  Play,
  Pause
} from 'lucide-react';

// DIFFICULTY_SETTINGS'i güncelle - hız değerlerini düşür
const DIFFICULTY_SETTINGS = {
  easy: { speed: 0.5, wordCount: 3, lives: 3, speedMultiplier: 1 },    // lives changed to 3
  medium: { speed: 0.8, wordCount: 3, lives: 3, speedMultiplier: 1.5 }, // lives changed to 3
  hard: { speed: 1.2, wordCount: 4, lives: 3, speedMultiplier: 2 }     // lives changed to 3
};

// Yeni pozisyonlar - daha mobil uyumlu
const LANE_POSITIONS = {
  0: '20%',    // Sol şerit
  1: '50%',    // Orta şerit
  2: '80%'     // Sağ şerit
};

// Yol işareti komponenti
const RoadMarker = ({ darkMode, position, offset = 0 }) => (
  <motion.div
    initial={{ y: -20 + offset }}
    animate={{ y: window.innerHeight + 20 }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
      delay: offset / 1000
    }}
    className={`absolute w-6 h-16 ${
      darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'
    }`}
    style={{
      left: position,
      transform: 'translateX(-50%)'
    }}
  />
);

// Skor göstergesi komponenti
const ScoreIndicator = ({ score, combo, darkMode }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    className={`fixed top-1/4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl ${
      darkMode
        ? 'bg-violet-500/20 text-violet-300'
        : 'bg-violet-50 text-violet-600'
    } font-bold text-xl backdrop-blur-sm z-50`}
  >
    +{Math.floor(score * (1 + combo * 0.1))}
    {combo > 1 && (
      <span className="ml-2 text-sm">
        x{combo} Combo!
      </span>
    )}
  </motion.div>
);

// WordCard bileşenini güncelle - sadece Lehçe kelimeyi göster
const WordCard = ({ word, position, lane, isActive, darkMode }) => (
  <motion.div
    initial={{ y: -50, scale: 0.8 }}
    animate={{
      y: `${position}%`,
      x: LANE_POSITIONS[lane],
      scale: isActive ? 1.1 : 1
    }}
    className="absolute left-0 -translate-x-1/2 touch-none z-20 w-32 sm:w-40" // Genişlik eklendi
  >
    <motion.div
      className={`px-3 py-2 rounded-xl shadow-lg backdrop-blur-md ${
        darkMode
          ? 'bg-violet-500/40 border-violet-400/50'
          : 'bg-violet-100/90 border-violet-500/50'
      } border`}
    >
      <div className="text-base sm:text-lg font-bold text-center break-words">
        {word.polish}
      </div>
    </motion.div>
  </motion.div>
);

// Türkçe seçenekler komponenti
const TurkishOptions = ({ options, onSelect, correctAnswer, darkMode }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowResult(true);

    // Önce seçim efektini göster, sonra onSelect'i çağır
    setTimeout(() => {
      onSelect(option);
      setSelectedOption(null);
      setShowResult(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOptionClick(option)}
          className={`min-h-[3rem] p-2 sm:p-3 rounded-xl transition-colors duration-300 ${
            showResult && selectedOption === option
              ? option === correctAnswer
                ? darkMode
                  ? 'bg-green-500/30 text-green-300 border-green-400'
                  : 'bg-green-100 text-green-700 border-green-500'
                : darkMode
                  ? 'bg-red-500/30 text-red-300 border-red-400'
                  : 'bg-red-100 text-red-700 border-red-500'
              : darkMode
                ? 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-700'
                : 'bg-white/90 hover:bg-gray-50/90 border-gray-200'
          } border backdrop-blur-sm`}
        >
          <span className="font-medium text-sm sm:text-base break-words">
            {option}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

// GameArea komponentini güncelle
const GameArea = ({ words, activeWords, darkMode, isNitroActive, isPaused, onPause, onWordClick }) => (
  <div className="relative h-[50vh] sm:h-[60vh] rounded-[2rem] overflow-hidden">
    {/* Yol arka planı */}
    <div className={`absolute inset-0 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Yol şeritleri */}
      <div className="absolute inset-x-0 h-full grid grid-cols-3">
        {[0, 1, 2].map(lane => (
          <div
            key={lane}
            className="relative border-x border-dashed border-gray-500/20"
          >
            {/* Animasyonlu yol işaretleri */}
            {[...Array(4)].map((_, i) => (
              <RoadMarker
                key={`marker-${lane}-${i}`}
                darkMode={darkMode}
                position={LANE_POSITIONS[lane]}
                offset={i * 500}
              />
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Kelimeler */}
    <AnimatePresence>
      {activeWords.map(({ word, position, lane, isActive }, index) => (
        <WordCard
          key={`${word.polish}-${index}`}
          word={word}
          position={position}
          lane={lane}
          isActive={isActive} // index === 0 yerine isActive kullan
          onSpeak={() => {
            const utterance = new SpeechSynthesisUtterance(word.polish);
            utterance.lang = 'pl-PL';
            window.speechSynthesis.speak(utterance);
          }}
          darkMode={darkMode}
          onClick={onWordClick} // Tıklama fonksiyonunu geçir
        />
      ))}
    </AnimatePresence>

    {/* Bitiş çizgisi */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500">
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 bg-red-500/50 blur"
      />
    </div>

    {/* Yol kenarı efektleri */}
    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/20 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/20 to-transparent" />

    {/* Nitro efekti */}
    {isNitroActive && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
        className="absolute inset-0 bg-violet-500/10"
      />
    )}

    {/* Pause Button Overlay - daha modern ve iOS tarzı */}
    <motion.button
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      onClick={onPause}
      className="absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-all"
    >
      <div className={`p-6 rounded-full ${
        darkMode
          ? 'bg-black/20 hover:bg-black/30'
          : 'bg-white/20 hover:bg-white/30'
      } backdrop-blur-md transition-colors`}>
        <Pause size={32} className="text-white drop-shadow-lg" />
      </div>
    </motion.button>

    {/* Pause/Play Overlay */}
    {isPaused && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => isPaused.onResume()}
          className={`p-8 rounded-full ${
            darkMode
              ? 'bg-violet-500/20 text-violet-400'
              : 'bg-violet-100 text-violet-600'
          }`}
        >
          <Play size={48} />
        </motion.button>
      </motion.div>
    )}
  </div>
);// Stat kart komponenti
const StatCard = ({ icon: Icon, title, value, subtitle, color, darkMode }) => (
  <div className={`p-4 rounded-xl ${
    darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        darkMode
          ? `bg-${color}-500/20 text-${color}-400`
          : `bg-${color}-50 text-${color}-500`
      }`}>
        <Icon size={20} />
      </div>
      <div>
        <div className={`font-bold text-2xl ${
          darkMode ? `text-${color}-400` : `text-${color}-600`
        }`}>
          {value}
        </div>
        <div className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-xs mt-0.5 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Ayarlar modalı komponenti
const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange, darkMode }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md p-6 rounded-2xl ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } border shadow-xl`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Oyun Ayarları
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Oyun Hızı */}
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Oyun Hızı
              </label>
              <input
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                value={settings.gameSpeed}
                onChange={(e) => onSettingsChange('gameSpeed', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                {settings.gameSpeed}x
              </div>
            </div>

            {/* Ses Efektleri */}
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Ses Efektleri
              </span>
              <button
                onClick={() => onSettingsChange('soundEnabled', !settings.soundEnabled)}
                className={`p-2 rounded-lg ${
                  settings.soundEnabled
                    ? darkMode
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-violet-100 text-violet-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>

            {/* Zorluk Seviyesi */}
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Zorluk Seviyesi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => onSettingsChange('difficulty', level)}
                    className={`py-2 px-4 rounded-lg ${
                      settings.difficulty === level
                        ? darkMode
                          ? 'bg-violet-500 text-white'
                          : 'bg-violet-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sadece Kapat butonu */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              } font-medium`}
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Ana bileşende yapılacak değişiklikler
const WordRacing = ({ words = [], darkMode = false, difficulty = 'medium', onBack }) => {
  // State tanımlamaları
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(DIFFICULTY_SETTINGS[difficulty].lives);
  const [gameSpeed, setGameSpeed] = useState(DIFFICULTY_SETTINGS[difficulty].speed);
  const [activeWords, setActiveWords] = useState([]);
  const [input, setInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [nitro, setNitro] = useState(0);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('wordRacingHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const inputRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    gameSpeed: DIFFICULTY_SETTINGS[difficulty].speed,
    soundEnabled: true,
    difficulty: difficulty
  });

  const [isPaused, setIsPaused] = useState(false);
  const [turkishOptions, setTurkishOptions] = useState([]);

  // Ayarları güncelleme fonksiyonu
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // Ayarları hemen uygula ve activeWords'ün hızını da güncelle
    if (key === 'gameSpeed') {
      setGameSpeed(value);
      setActiveWords(prev => prev.map(word => ({
        ...word,
        speed: value * (Math.random() * 0.4 + 0.8) * DIFFICULTY_SETTINGS[settings.difficulty].speedMultiplier
      })));
    } else if (key === 'soundEnabled') {
      setIsSoundEnabled(value);
    } else if (key === 'difficulty') {
      const newSpeed = DIFFICULTY_SETTINGS[value].speed;
      setLives(DIFFICULTY_SETTINGS[value].lives);
      setGameSpeed(newSpeed);
      setSettings(prev => ({ ...prev, gameSpeed: newSpeed }));
      setActiveWords(prev => prev.map(word => ({
        ...word,
        speed: newSpeed * (Math.random() * 0.4 + 0.8) * DIFFICULTY_SETTINGS[value].speedMultiplier
      })));
    }
  };

  // Kelime oluşturma
  const createWord = useCallback(() => {
    const availableWords = words.filter(w =>
      !w.used && !activeWords.find(active => active.word === w)
    );

    if (availableWords.length === 0) {
      words.forEach(w => w.used = false);
      return null;
    }

    const correctWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    correctWord.used = true;

    // Yanlış seçenekleri oluştur
    const wrongOptions = words
      .filter(w => w !== correctWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(w => w.turkish);

    // Doğru ve yanlış seçenekleri karıştır
    const options = [...wrongOptions, correctWord.turkish]
      .sort(() => Math.random() - 0.5);

    setTurkishOptions(options);
    return correctWord;
  }, [words, activeWords]);

  // Oyun döngüsü
  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        setActiveWords(prev => {
          // Eğer aktif kelime yoksa yeni kelime oluştur
          if (prev.length === 0) {
            const newWord = createWord();
            if (newWord) {
              return [{
                word: newWord,
                position: -10,
                lane: 1, // Orta şerit
                speed: gameSpeed * DIFFICULTY_SETTINGS[difficulty].speedMultiplier * 0.5,
                isActive: true
              }];
            }
          }

          // Mevcut kelimeyi güncelle
          return prev.map(word => ({
            ...word,
            position: word.position + (word.speed * (isNitroActive ? 1.5 : 1) * 0.5)
          }));
        });
      }, 50);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameOver, isNitroActive, gameSpeed, difficulty, createWord, isPaused]);

  // Nitro efekti
  useEffect(() => {
    if (isNitroActive) {
      const timer = setTimeout(() => {
        setIsNitroActive(false);
        setGameSpeed(DIFFICULTY_SETTINGS[difficulty].speed);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isNitroActive, difficulty]);

  // Kelime kontrolü
  // eslint-disable-next-line no-unused-vars
  const checkWord = useCallback(() => {
    if (!input.trim()) return;

    const activeWord = activeWords.find(w => w.isActive)?.word;
    if (activeWord && input.toLowerCase().trim() === activeWord.turkish.toLowerCase().trim()) {
      // Doğru cevap
      setActiveWords(prev => prev.filter(w => w.word !== activeWord));
      const points = Math.floor(100 * (1 + combo * 0.1));
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setNitro(prev => Math.min(prev + 10, 100));
      setShowScore(true);
      setTimeout(() => setShowScore(false), 1000);

      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } else {
      // Yanlış cevap
      setCombo(0);
      setLives(prev => {
        if (prev <= 1) setGameOver(true);
        return prev - 1;
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
    }

    setInput('');
  }, [input, activeWords, combo]);

  // Nitro kullanımı
  // eslint-disable-next-line no-unused-vars
  const useNitro = useCallback(() => {
    if (nitro >= 100) {
      setIsNitroActive(true);
      setGameSpeed(prev => prev * 1.5);
      setNitro(0);
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [nitro]);

  // Yüksek skor kontrolü
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordRacingHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  // Ayarlar modalı açıldığında oyunu duraklat
  useEffect(() => {
    if (showSettings) {
      setIsPaused(true);
    }
  }, [showSettings]);

  // Ayarlar modalını kapatma fonksiyonu
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // Oyun duraklatma fonksiyonu
  const handlePause = () => {
    setIsPaused(true);
  };

  // Kelime seçme fonksiyonu
  const handleOptionSelect = (selectedOption) => {
    const activeWord = activeWords[0]?.word;

    if (activeWord && selectedOption === activeWord.turkish) {
      // Doğru cevap
      setActiveWords([]);
      const points = Math.floor(100 * (1 + combo * 0.1));
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setNitro(prev => Math.min(prev + 10, 100));
      setShowScore(true);
      setTimeout(() => setShowScore(false), 1000);
    } else {
      // Yanlış cevap
      setCombo(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden px-4 py-safe space-y-3 sm:space-y-4">
      {/* Üst Bilgi Çubuğu */}
      <div className={`p-3 sm:p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-md`}>
        {/* Kontrol butonları */}
        <div className="flex justify-between items-center mb-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-1.5 py-1 pl-1 pr-3 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className={`p-1.5 rounded-full ${
              darkMode
                ? 'bg-gray-700/80'
                : 'bg-gray-100/80'
            }`}>
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Geri</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700/80 hover:bg-gray-600/80'
                  : 'bg-gray-100/80 hover:bg-gray-200/80'
              } backdrop-blur-sm`}
            >
              {isSoundEnabled ? <Music size={18} /> : <VolumeX size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSettings(true);
                setIsPaused(true);
              }}
              className={`p-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700/80 hover:bg-gray-600/80'
                  : 'bg-gray-100/80 hover:bg-gray-200/80'
              } backdrop-blur-sm`}
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>

        {/* Mevcut grid yapısı */}
        <div className="grid grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
            <div>
              <div className="text-xs opacity-60">Puan</div>
              <div className="font-bold">{score}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className={darkMode ? 'text-emerald-400' : 'text-emerald-500'} />
            <div>
              <div className="text-xs opacity-60">Kombo</div>
              <div className="font-bold">x{combo}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className={darkMode ? 'text-red-400' : 'text-red-500'} />
            <div>
              <div className="text-xs opacity-60">Can</div>
              <div className="font-bold">{lives}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Car className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
            <div>
              <div className="text-xs opacity-60">Hız</div>
              <div className="font-bold">{gameSpeed}x</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className={`${
              isNitroActive
                ? 'text-orange-500 animate-pulse'
                : darkMode ? 'text-orange-400' : 'text-orange-500'
            }`} />
            <div>
              <div className="text-xs opacity-60">Nitro</div>
              <div className="font-bold">{nitro}%</div>
            </div>
          </div>
        </div>

        {/* Nitro çubuğu */}
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${nitro}%` }}
            className={`h-full rounded-full ${
              isNitroActive
                ? 'bg-orange-500 animate-pulse'
                : darkMode ? 'bg-orange-400' : 'bg-orange-500'
            }`}
          />
        </div>
      </div>

      {/* Oyun Alanı */}
      <GameArea
        words={words}
        activeWords={activeWords}
        darkMode={darkMode}
        isNitroActive={isNitroActive}
        isPaused={isPaused && {
          onResume: () => setIsPaused(false)
        }}
        onPause={handlePause}
      />

      {/* Türkçe seçenekler */}
      <div className={`p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-md`}>
        <TurkishOptions
          options={turkishOptions}
          onSelect={handleOptionSelect}
          correctAnswer={activeWords[0]?.word.turkish} // Doğru cevabı doğru şekilde geç
          darkMode={darkMode}
        />
      </div>

      {/* Puan Göstergesi */}
      <AnimatePresence>
        {showScore && (
          <ScoreIndicator
            score={100}
            combo={combo}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Oyun Sonu Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } border shadow-xl`}
            >
              <div className="text-center space-y-4">
                <Trophy className={`w-16 h-16 mx-auto ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-500'
                }`} />

                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Yarış Bitti!
                </h2>

                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {score > highScore
                    ? 'Yeni yüksek skor!'
                    : 'İyi bir skor elde ettin!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6">
                <StatCard
                  icon={Trophy}
                  title="Toplam Puan"
                  value={score}
                  color="yellow"
                  darkMode={darkMode}
                />

                <StatCard
                  icon={Crown}
                  title="En Yüksek Skor"
                  value={Math.max(score, highScore)}
                  color="amber"
                  darkMode={darkMode}
                />

                <StatCard
                  icon={Star}
                  title="En Yüksek Kombo"
                  value={combo}
                  color="emerald"
                  darkMode={darkMode}
                />

                <StatCard
                  icon={Zap}
                  title="Son Hız"
                  value={`${gameSpeed}x`}
                  color="blue"
                  darkMode={darkMode}
                />
              </div><div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setScore(0);
                    setLives(DIFFICULTY_SETTINGS[difficulty].lives);
                    setGameSpeed(DIFFICULTY_SETTINGS[difficulty].speed);
                    setCombo(0);
                    setNitro(0);
                    setIsNitroActive(false);
                    setActiveWords([]);
                    setGameOver(false);
                    setInput('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-violet-500 hover:bg-violet-600'
                      : 'bg-violet-500 hover:bg-violet-600'
                  } text-white font-medium`}
                >
                  <RefreshCw size={20} />
                  Tekrar Oyna
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } font-medium`}
                >
                  <ArrowLeft size={20} />
                  Menüye Dön
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ayarlar Modalı */}
      <SettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        darkMode={darkMode}
      />

      {/* Arka Plan Efekti */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[30rem] w-[30rem] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          </div>
        </div>
        <div className="absolute inset-0 backdrop-blur-xl" />
      </div>

      {/* iOS Safe Area Desteği */}
      <style jsx global>{`
        :root {
          --sat: env(safe-area-inset-top);
          --sar: env(safe-area-inset-right);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
        }

        .py-safe {
          padding-top: max(1rem, var(--sat));
          padding-bottom: max(1rem, var(--sab));
        }

        .bottom-safe {
          bottom: max(1.5rem, var(--sab));
        }

        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
        }

        body {
          -webkit-tap-highlight-color: transparent;
        }

        /* iOS tarzı kaydırma */
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default WordRacing;
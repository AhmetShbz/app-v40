import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Confetti from 'react-confetti';
import {
  Shield,
  Heart,
  Timer,
  Star,
  Trophy,
  Volume2,
  ArrowLeft,
  RefreshCw,
  Crown,
  Zap,
  Brain,
  SwordIcon,
  Target
} from 'lucide-react';

const DIFFICULTY_SETTINGS = {
  easy: {
    timeLimit: 30,
    points: 100,
    lives: 5,
    specialMoveChance: 0.4,
    comboMultiplier: 1.1,
    label: 'Kolay'
  },
  medium: {
    timeLimit: 20,
    points: 200,
    lives: 3,
    specialMoveChance: 0.3,
    comboMultiplier: 1.2,
    label: 'Orta'
  },
  hard: {
    timeLimit: 15,
    points: 300,
    lives: 2,
    specialMoveChance: 0.2,
    comboMultiplier: 1.3,
    label: 'Zor'
  }
}; // Burası düzeltildi

const SPECIAL_MOVES = {
  timeFreeze: {
    name: 'Zaman Dondurma',
    icon: Timer,
    effect: 'Süreyi 5 saniye durdurur',
    color: 'blue'
  },
  doublePoints: {
    name: 'Çift Puan',
    icon: Star,
    effect: '3 kelime boyunca çift puan',
    color: 'yellow'
  },
  extraLife: {
    name: 'Ekstra Can',
    icon: Heart,
    effect: '1 can kazanırsın',
    color: 'red'
  }
};

// ElevenLabs ses çalma fonksiyonu
const playAudioWithElevenLabs = async (text, voice_id = 'XB0fDUnXU5powFXDhCwa') => {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      headers: {
        Accept: 'audio/mpeg',
        'xi-api-key': process.env.REACT_APP_ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          speed: 0.75
        }
      },
      responseType: 'arraybuffer'
    });

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(response.data);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Error playing audio:', error);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    window.speechSynthesis.speak(utterance);
  }
};

// Zorluk seviyesi seçim modalı
const DifficultyModal = ({ onSelect, darkMode }) => (
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
      <h2 className={`text-2xl font-bold text-center mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Zorluk Seviyesi Seç
      </h2>

      <div className="grid gap-4">
        {Object.entries(DIFFICULTY_SETTINGS).map(([key, setting]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-4 rounded-xl ${
              darkMode
                ? 'bg-gray-700/50 hover:bg-gray-700'
                : 'bg-gray-50 hover:bg-gray-100'
            } flex items-start gap-4`}
          >
            {key === 'easy' && <Brain className="w-6 h-6 text-green-500" />}
            {key === 'medium' && <SwordIcon className="w-6 h-6 text-yellow-500" />}
            {key === 'hard' && <Target className="w-6 h-6 text-red-500" />}

            <div className="flex-1">
              <h3 className={`font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {setting.label}
              </h3>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="font-medium">Süre:</span> {setting.timeLimit}s
                </div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="font-medium">Can:</span> {setting.lives}
                </div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="font-medium">Puan:</span> {setting.points}
                </div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="font-medium">Kombo:</span> x{setting.comboMultiplier}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  </motion.div>
);// Word Card komponenti
const WordCard = ({ word, isActive, onSpeak, isCorrect, isWrong, darkMode }) => (
  <motion.div
    whileHover={{ scale: isActive ? 1.05 : 1 }}
    animate={
      isCorrect
        ? { scale: [1, 1.2, 1], borderColor: ['#10B981', '#10B981', 'transparent'] }
        : isWrong
          ? { scale: [1, 0.9, 1], borderColor: ['#EF4444', '#EF4444', 'transparent'] }
          : {}
    }
    className={`p-6 rounded-xl ${
      isActive
        ? darkMode
          ? 'bg-violet-500/20 ring-2 ring-violet-400'
          : 'bg-violet-50 ring-2 ring-violet-500'
        : darkMode
          ? 'bg-gray-800/80'
          : 'bg-white/90'
    } shadow-lg backdrop-blur-sm transition-all duration-300`}
  >
    <div className="space-y-4">
      {/* Lehçe kelimesi */}
      <motion.div
        className={`text-2xl font-bold text-center ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
        initial={false}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {word?.polish}
      </motion.div>

      {/* Türkçe ipucu - yanlış cevap verildiğinde göster */}
      {isWrong && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-lg text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {word?.turkish}
        </motion.div>
      )}
    </div>

    <div className="flex justify-center gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSpeak(word.polish)}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          darkMode
            ? 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-300'
            : 'bg-violet-50 hover:bg-violet-100 text-violet-600'
        }`}
      >
        <Volume2 size={18} />
        Dinle
      </motion.button>
    </div>

    {word.difficulty && (
      <div className={`mt-3 text-center text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {word.difficulty === 'Kolay' && <span className="text-green-500">●</span>}
        {word.difficulty === 'Orta' && <span className="text-yellow-500">●●</span>}
        {word.difficulty === 'Zor' && <span className="text-red-500">●●●</span>}
        <span className="ml-2">{word.difficulty}</span>
      </div>
    )}
  </motion.div>
);

// Özel güç kartı komponenti
const SpecialMoveCard = ({ move, isActive, onUse, darkMode }) => {
  const Icon = move.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onUse}
      disabled={!isActive}
      className={`p-4 rounded-xl ${
        isActive
          ? darkMode
            ? `bg-${move.color}-500/20 ring-1 ring-${move.color}-400`
            : `bg-${move.color}-50 ring-1 ring-${move.color}-500`
          : darkMode
            ? 'bg-gray-800/50 opacity-50'
            : 'bg-gray-100/50 opacity-50'
      } flex flex-col items-center gap-2`}
    >
      <Icon className={`w-6 h-6 text-${move.color}-${darkMode ? '400' : '500'}`} />
      <div className={`text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {move.name}
      </div>
      <div className={`text-xs text-center ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {move.effect}
      </div>
    </motion.button>
  );
};

// Skor göstergesi komponenti
const ScoreIndicator = ({ points, combo, darkMode }) => (
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
    +{points}
    {combo > 1 && (
      <span className="ml-2 text-sm">
        x{combo} Combo!
      </span>
    )}
  </motion.div>
);

// İlerleme çubuğu komponenti
const ProgressBar = ({ value, maxValue, color, darkMode }) => (
  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${(value / maxValue) * 100}%` }}
      className={`h-full rounded-full bg-${color}-${darkMode ? '400' : '500'}`}
      transition={{ type: 'spring', stiffness: 120, damping: 10 }}
    />
  </div>
);

// Stat kart komponenti
const StatCard = ({ icon: Icon, title, value, color, darkMode }) => (
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
      </div>
    </div>
  </div>
);// Ana oyun komponenti
const WordDuel = ({ words = [], darkMode = false, onBack }) => {
  // State tanımlamaları
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(DIFFICULTY_SETTINGS.medium.lives);
  const [timer, setTimer] = useState(DIFFICULTY_SETTINGS.medium.timeLimit);
  const [combo, setCombo] = useState(0);
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [specialMoves, setSpecialMoves] = useState({
    timeFreeze: { active: false, count: 2 },
    doublePoints: { active: false, count: 2 },
    extraLife: { active: false, count: 1 },
  });
  const [showScore, setShowScore] = useState(false);
  const [highScore, setHighScore] = useState(() =>
    localStorage.getItem('wordDuelHighScore')
      ? parseInt(localStorage.getItem('wordDuelHighScore'))
      : 0
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const inputRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Kelime seçme ve filtreleme - Düzeltilmiş versiyon
const selectWord = useCallback(() => {
  if (!words || words.length === 0) {
    console.log('No words available');
    return null;
  }

  // Filtrelemeyi yaparken kelime havuzunu kopyalayalım
  const filteredWords = words.filter(word =>
    !word.used &&
    (difficulty === 'easy' ? word.difficulty === 'Kolay' :
     difficulty === 'medium' ? word.difficulty === 'Orta' :
     word.difficulty === 'Zor')
  );

  // Eğer hiç kelime kalmadıysa tüm kelimeleri sıfırla
  if (filteredWords.length === 0) {
    // Tüm kelimelerin used özelliğini sıfırla
    words.forEach(w => w.used = false);
    // Tekrar filtreleme yap
    const resetWords = words.filter(word =>
      difficulty === 'easy' ? word.difficulty === 'Kolay' :
      difficulty === 'medium' ? word.difficulty === 'Orta' :
      word.difficulty === 'Zor'
    );
    // Rastgele bir kelime seç
    const word = resetWords[Math.floor(Math.random() * resetWords.length)];
    if (word) {
      word.used = true;
      console.log('Selected word:', word); // Debug için
      return word;
    }
  }

  // Filtrelenmiş kelimelerden rastgele bir kelime seç
  const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  if (word) {
    word.used = true;
    console.log('Selected word:', word); // Debug için
    return word;
  }

  return null;
}, [words, difficulty]);

  // Oyunu başlat
  const startGame = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setLives(DIFFICULTY_SETTINGS[selectedDifficulty].lives);
    setTimer(DIFFICULTY_SETTINGS[selectedDifficulty].timeLimit);
    setShowDifficultyModal(false);
    setCurrentWord(selectWord());
    if (inputRef.current) inputRef.current.focus();
  }, [selectWord]);

  // Ses çalma
  const handlePlayAudio = useCallback(async (text) => {
    await playAudioWithElevenLabs(text);
  }, []);

  // Özel güç kullanımı
  const handleSpecialMove = useCallback((moveType) => {
    if (specialMoves[moveType].count > 0) {
      setSpecialMoves(prev => ({
        ...prev,
        [moveType]: {
          active: true,
          count: prev[moveType].count - 1
        }
      }));

      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      switch (moveType) {
        case 'timeFreeze':
          setTimeout(() => {
            setSpecialMoves(prev => ({
              ...prev,
              timeFreeze: { ...prev.timeFreeze, active: false }
            }));
          }, 5000);
          break;
        case 'doublePoints':
          setTimeout(() => {
            setSpecialMoves(prev => ({
              ...prev,
              doublePoints: { ...prev.doublePoints, active: false }
            }));
          }, 10000);
          break;
        case 'extraLife':
          setLives(prev => Math.min(prev + 1, 5));
          break;
        default:
          break;
      }
    }
  }, [specialMoves]);

  // Kelime kontrolü için yardımcı fonksiyon
const normalizeWord = (word) => {
  return word
    .toLowerCase()
    .trim()
    .replace(/i/g, 'ı')
    .replace(/e/g, 'e')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g');
};

// Fiil kontrolü için yardımcı fonksiyon
const checkVerb = (input, target) => {
  const normalizedInput = normalizeWord(input);
  const normalizedTarget = normalizeWord(target);

  // Tam eşleşme kontrolü
  if (normalizedInput === normalizedTarget) return true;

  // Fiil kökü kontrolü
  if (normalizedTarget.endsWith('mek') || normalizedTarget.endsWith('mak')) {
    const targetRoot = normalizedTarget.slice(0, -3); // Son 3 harfi (mek/mak) çıkar
    return normalizedInput === targetRoot || normalizedInput === targetRoot + 'mek' || normalizedInput === targetRoot + 'mak';
  }

  return false;
};

// Kelime kontrolü fonksiyonu güncelleniyor
const checkWord = useCallback(() => {
  if (!userInput.trim() || !currentWord) return;

  const isCorrect = checkVerb(userInput, currentWord.turkish);

  if (isCorrect) {
    setIsCorrect(true);
    setShowConfetti(true);
    const basePoints = DIFFICULTY_SETTINGS[difficulty].points;
    const comboMultiplier = DIFFICULTY_SETTINGS[difficulty].comboMultiplier;
    const points = Math.floor(basePoints * (1 + (combo * comboMultiplier)));

    setScore(prev => prev + (specialMoves.doublePoints.active ? points * 2 : points));
    setCombo(prev => prev + 1);
    setShowScore(true);
    setTimer(DIFFICULTY_SETTINGS[difficulty].timeLimit);

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // 1 saniye sonra konfeti ve diğer efektleri kaldır, yeni kelimeye geç
    setTimeout(() => {
      setShowConfetti(false);
      setIsCorrect(false);
      setShowScore(false);
      setCurrentWord(selectWord());
      setUserInput('');
    }, 1000);
  } else {
    setIsWrong(true);
    setCombo(0);
    setLives(prev => prev - 1);

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    setTimeout(() => {
      setIsWrong(false);
      if (lives <= 1) {
        setGameOver(true);
      }
    }, 1000);
  }

  setUserInput('');
}, [userInput, currentWord, combo, difficulty, lives, selectWord, specialMoves.doublePoints.active]);

  // Input değişikliklerini kontrol eden fonksiyon
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setUserInput(value);
    // Space tuşu kontrolünü kaldırdık
  }, []);

  // Input alanından focus kalkınca kontrol eden fonksiyon
  const handleInputBlur = useCallback(() => {
    if (userInput.trim()) {
      checkWord();
    }
  }, [userInput, checkWord]);

  // Oyun döngüsü
  useEffect(() => {
    if (!gameOver && !showDifficultyModal && !specialMoves.timeFreeze.active) {
      gameLoopRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(gameLoopRef.current);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameOver, showDifficultyModal, specialMoves.timeFreeze.active]);

  // Yüksek skor kontrolü
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordDuelHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  // Yüksek skor kontrolü useEffect'inden sonra ve return'den önce handleRestart'ı tanımlıyoruz
  const handleRestart = useCallback(() => {
    setShowDifficultyModal(true);
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setSpecialMoves({
      timeFreeze: { active: false, count: 2 },
      doublePoints: { active: false, count: 2 },
      extraLife: { active: false, count: 1 },
    });
  }, []);

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Konfeti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          gravity={0.5}
          tweenDuration={4000}
        />
      )}

      {/* Zorluk Seviyesi Seçimi */}
      <AnimatePresence>
        {showDifficultyModal && (
          <DifficultyModal
            onSelect={startGame}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Üst Bilgi Çubuğu */}
      <div className={`p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-md`}>
        {/* Kontrol butonları */}
        <div className="flex justify-between items-center">
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

          <h2 className={`text-lg font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kelime Düellosu
          </h2>
          <div className="w-10" /> {/* Denge için boş div */}
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
            <div>
              <div className="text-xs opacity-60">Puan</div>
              <div className="font-bold">{score}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className={darkMode ? 'text-violet-400' : 'text-violet-500'} />
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
            <Timer className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
            <div>
              <div className="text-xs opacity-60">Süre</div>
              <div className="font-bold">{timer}s</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className={darkMode ? 'text-emerald-400' : 'text-emerald-500'} />
            <div>
              <div className="text-xs opacity-60">Zorluk</div>
              <div className="font-bold">{DIFFICULTY_SETTINGS[difficulty].label}</div>
            </div>
          </div>
        </div>

        {/* Zaman çubuğu */}
        <div className="mt-2">
          <ProgressBar
            value={timer}
            maxValue={DIFFICULTY_SETTINGS[difficulty].timeLimit}
            color="violet"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Kelime Kartı */}
      {currentWord && (
        <div className="max-w-md mx-auto">
          <WordCard
            word={currentWord}
            isActive={true}
            onSpeak={handlePlayAudio}
            isCorrect={isCorrect}
            isWrong={isWrong}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Kontrol Alanı */}
      <div className={`p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-sm space-y-4`}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur} // Blur handler eklendi
            onKeyPress={(e) => e.key === 'Enter' && checkWord()}
            placeholder="Türkçe çevirisini yazın..."
            className={`w-full px-6 py-4 text-xl rounded-xl outline-none ${
              darkMode
                ? 'bg-gray-700/50 text-white placeholder-gray-500'
                : 'bg-gray-50/50 text-gray-900 placeholder-gray-400'
            } border-2 border-transparent focus:border-violet-500/50`}
            disabled={gameOver}
          />
        </div>

        {/* Özel Güçler */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(SPECIAL_MOVES).map(([key, move]) => (
            <SpecialMoveCard
              key={key}
              move={move}
              isActive={specialMoves[key].count > 0 && !gameOver}
              onUse={() => handleSpecialMove(key)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* Puan Göstergesi */}
      <AnimatePresence>
        {showScore && (
          <ScoreIndicator
            points={DIFFICULTY_SETTINGS[difficulty].points * (1 + (combo * DIFFICULTY_SETTINGS[difficulty].comboMultiplier))}
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
                  Düello Bitti!
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
                  color="violet"
                  darkMode={darkMode}
                />

                <StatCard
                  icon={Zap}
                  title="Zorluk"
                  value={DIFFICULTY_SETTINGS[difficulty].label}
                  color="emerald"
                  darkMode={darkMode}
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestart}
                  className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-violet-500 hover:bg-violet-600 text-white'
                      : 'bg-violet-100 hover:bg-violet-200 text-violet-600'
                  }`}
                >
                  <RefreshCw size={20} />
                  Tekrar Oyna
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <ArrowLeft size={20} />
                  Geri
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordDuel;
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import {
  Timer, Star, Trophy, Shield, Heart,
  Volume2, Crown, ArrowLeft, RefreshCw,
  Music, VolumeX, X,
  HelpCircle, Book, Share2
} from 'lucide-react';

// Ses efektleri
const SOUNDS = {
  correct: new Audio('/sounds/correct.mp3'),
  wrong: new Audio('/sounds/wrong.mp3'),
  hint: new Audio('/sounds/hint.mp3'),
  win: new Audio('/sounds/win.mp3'),
  lose: new Audio('/sounds/lose.mp3'),
  click: new Audio('/sounds/click.mp3'),
};

// Zorluk ayarları
const DIFFICULTY_SETTINGS = {
  easy: { timeLimit: 120, hints: 5, lives: 5 },
  medium: { timeLimit: 90, hints: 3, lives: 3 },
  hard: { timeLimit: 60, hints: 1, lives: 2 }
};

// Modal bileşeni
const Modal = ({ title, children, onClose, darkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`w-full max-w-lg p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100/10"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

// StatItem bileşeni
const StatItem = ({ icon: Icon, value, label, iconColor }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <Icon className={`w-6 h-6 ${iconColor}`} />
    <div className="font-bold text-lg">{value}</div>
    <div className="text-xs opacity-60">{label}</div>
  </div>
);

// Button bileşeni
const Button = ({ children, icon: Icon, onClick, variant = 'primary', className = '' }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${className} py-3 px-4 rounded-xl flex items-center justify-center gap-2
      ${variant === 'primary'
        ? 'bg-violet-500 text-white hover:bg-violet-600'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
  >
    {Icon && <Icon size={20} />}
    {children}
  </motion.button>
);

// LetterTile bileşenini güncelle - disabled prop'unu ekle
const LetterTile = ({
  letter,
  isSelected,
  isCorrect,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  darkMode,
  disabled,
  position, // Yeni: Harfin hedef pozisyonu
  isAnimating, // Yeni: Animasyon durumu
  isWrong, // Yeni: Yanlış pozisyon kontrolü
  isReturning, // Yeni prop ekledik
  currentIndex, // Yeni: Harfin mevcut pozisyonu
  correctLetter, // Yeni: Olması gereken harf
}) => (
  <motion.div
    drag={!disabled && !isAnimating}
    dragConstraints={{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }}
    initial={isAnimating ? {
      scale: 1,
      y: 0,
      x: 0
    } : false}
    animate={isAnimating ? {
      y: position?.y || 0,
      x: position?.x || 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    } : isReturning ? { // Geri dönüş animasyonu
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    } : {}}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    dragElastic={1}
    whileDrag={{ scale: 1.1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={!disabled && !isAnimating ? onClick : undefined}
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={`w-full h-full aspect-square rounded-xl border-2 flex items-center justify-center text-base sm:text-lg font-bold ${disabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'} select-none
      ${isSelected
        ? correctLetter === letter // Doğru/yanlış kontrolü
          ? darkMode
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : darkMode
            ? 'bg-red-500/20 border-red-500/30 text-red-400'
            : 'bg-red-50 border-red-200 text-red-600'
        : darkMode
          ? 'bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-700/50'
          : 'bg-white/50 border-gray-200/50 text-gray-800 hover:bg-gray-50'
      } transition-colors`}
    >
      <span className="text-center w-full px-0.5 break-words">
        {isReturning ? '' : letter}
      </span>
  </motion.div>
);

// GameHeader bileşenini güncelle
const GameHeader = ({ score, lives, timer, level, hintsLeft, combo, darkMode, onBack, isSoundEnabled, onToggleSound, onShowTutorial }) => (
  <div className={`p-3 sm:p-4 rounded-xl ${
    darkMode ? 'bg-gray-800/50' : 'bg-white/50'
  } backdrop-blur-sm shadow-lg border border-gray-200/20`}>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
      {/* Sol Grup - Kontroller */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100/10 active:bg-gray-100/20 transition-colors"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onToggleSound}
          className="p-2 rounded-lg hover:bg-gray-100/10 active:bg-gray-100/20 transition-colors"
        >
          {isSoundEnabled ? (
            <Music size={18} className="sm:w-5 sm:h-5 text-violet-500" />
          ) : (
            <VolumeX size={18} className="sm:w-5 sm:h-5 opacity-50" />
          )}
        </button>
        <button
          onClick={onShowTutorial}
          className="p-2 rounded-lg hover:bg-gray-100/10 active:bg-gray-100/20 transition-colors"
        >
          <Book size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Orta Grup - Ana Metrikler */}
      <div className="flex-1 grid grid-cols-6 sm:flex items-center justify-center sm:justify-evenly gap-2 sm:gap-6">
        <StatBadge
          icon={Trophy}
          value={score}
          color="text-yellow-500"
          label="Puan"
        />
        <StatBadge
          icon={Star}
          value={level}
          color="text-violet-500"
          label="Seviye"
        />
        <StatBadge
          icon={HelpCircle}
          value={hintsLeft}
          color="text-blue-500"
          label="İpucu"
        />
        <StatBadge
          icon={Crown}
          value={`x${combo}`}
          color="text-emerald-500"
          label="Kombo"
        />
        <StatBadge
          icon={Heart}
          value={lives}
          color="text-red-500"
          label="Can"
        />
        <StatBadge
          icon={Timer}
          value={`${timer}s`}
          color="text-amber-500"
          label="Süre"
        />
      </div>
    </div>
  </div>
);

// StatBadge bileşenini ekle
const StatBadge = ({ icon: Icon, value, color, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="flex items-center gap-1.5">
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      <span className="font-medium">{value}</span>
    </div>
    <span className="text-[10px] sm:text-xs opacity-60">{label}</span>
  </div>
);

// Tutorial Modal içeriğini ekleyelim
const TutorialModal = ({ darkMode, onClose }) => (
  <Modal title="Nasıl Oynanır?" onClose={onClose} darkMode={darkMode}>
    <div className="space-y-4">
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Book className="w-5 h-5" />
          Temel Oynanış
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• Türkçe kelimenin Lehçe karşılığını bulun</li>
          <li>• Harfleri sürükleyerek veya tıklayarak doğru sırayla dizin</li>
          <li>• Her doğru kelime için puan ve süre bonusu kazanın</li>
          <li>• Kombo yaparak puanınızı katlayın</li>
        </ul>
      </div>

      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Ses ve İpuçları
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• Dinleme ikonu ile kelimenin telaffuzunu dinleyin</li>
          <li>• İpucu hakkınızı kullanarak yardım alın</li>
          <li>• Her 5 komboda ekstra can ve ipucu kazanın</li>
        </ul>
      </div>

      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Seviyeler
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• İlerledikçe daha zor kelimelerle karşılaşın</li>
          <li>• Her kelime için süreniz sınırlı</li>
          <li>• Canlarınızı dikkatli kullanın</li>
        </ul>
      </div>
    </div>
  </Modal>
);

// Ses dinleme butonunu ayrı bir bileşen olarak çıkaralım
const AudioButton = ({ word, onClick, darkMode }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-2 rounded-lg ${
      darkMode
        ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
        : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
    } transition-colors`}
  >
    <Volume2 size={20} />
  </motion.button>
);

export default function WordPuzzleGame({
  words = [],
  darkMode = false,
  difficulty = 'medium',
  onBack,
  onComplete
}) {
  // State tanımlamaları
  const [currentWord, setCurrentWord] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(DIFFICULTY_SETTINGS[difficulty].lives);
  const [timer, setTimer] = useState(DIFFICULTY_SETTINGS[difficulty].timeLimit);
  const [level, setLevel] = useState(1);
  const [hintsLeft, setHintsLeft] = useState(DIFFICULTY_SETTINGS[difficulty].hints);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFirstGame, setIsFirstGame] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [animatingLetter, setAnimatingLetter] = useState(null);

  // Ses efekti çalma
  const playSound = useCallback((soundName) => {
    if (isSoundEnabled && SOUNDS[soundName]) {
      SOUNDS[soundName].currentTime = 0;
      SOUNDS[soundName].play().catch(() => {});
    }
  }, [isSoundEnabled]);

  // Kelime hazırlama
  const prepareWord = useCallback(() => {
    // Seviyeye göre kelime seçimi
    const availableWords = words.filter(w => w.difficulty === (
      (level <= 3) ? 'Kolay' : (level <= 6) ? 'Orta' : 'Zor'
    ));

    if (availableWords.length === 0) return null; // Kelime yoksa null döndür

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];

    // Harfleri karıştır
    const letters = word.polish.split('').map((letter, index) => ({
      id: `${letter}-${index}`,
      letter,
    }));

    setShuffledLetters(letters.sort(() => Math.random() - 0.5));
    setCurrentWord(word); // Burayı ekleyelim

    return word;
  }, [words, level]);

  // Oyunu başlat
  useEffect(() => {
    if (!isFirstGame) {
      const word = prepareWord();
      if (word) {
        setCurrentWord(word);
      }

      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameStatus('timeout');
            setIsGameOver(true);
            playSound('lose');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isFirstGame, prepareWord, playSound]);

  // Kelime kontrolü
  useEffect(() => {
    if (selectedLetters.length === currentWord?.polish.length) {
      const selectedWord = selectedLetters.map(l => l.letter).join('');

      if (selectedWord === currentWord.polish) {
        // Doğru cevap
        playSound('correct');
        setScore(prev => prev + (100 * (combo + 1)));
        setCombo(prev => prev + 1);
        setShowConfetti(true);

        // Bonus can ve ipucu
        if (combo > 0 && combo % 5 === 0) {
          setLives(prev => Math.min(prev + 1, 5));
          setHintsLeft(prev => Math.min(prev + 1, 5));
        }

        // Level kontrolü ve yeni kelime hazırlığı
        setLevel(prev => prev + 1);
        setTimer(prev => prev + 15);

        // Önce yeni kelimeyi hazırla
        const nextWord = prepareWord();

        // 2 saniye sonra konfeti kaldır ve yeni kelimeyi göster
        setTimeout(() => {
          setShowConfetti(false);
          setCurrentWord(nextWord);
          setSelectedLetters([]);
        }, 2000);
      } else {
        // Yanlış cevap
        playSound('wrong');
        setCombo(0);
        setLives(prev => prev - 1);

        if (lives <= 1) {
          setGameStatus('lost');
          setIsGameOver(true);
          playSound('lose');
        } else {
          setTimeout(() => {
            setSelectedLetters([]);
          }, 1000);
        }
      }
    }
  }, [selectedLetters, currentWord, combo, lives, prepareWord, playSound]);

  // Harf seçme/sürükleme işlemleri
  const handleLetterSelect = useCallback((letterObj, sourceElement) => {
    if (!selectedLetters.includes(letterObj)) {
      playSound('click');

      const targetIndex = selectedLetters.length;
      const targetElement = document.querySelector(`[data-selected-index="${targetIndex}"]`);

      if (sourceElement && targetElement) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        const position = {
          x: targetRect.left - sourceRect.left,
          y: targetRect.top - sourceRect.top
        };

        // Önce harfi shuffledLetters'dan kaldır
        setShuffledLetters(prev => prev.filter(l => l.id !== letterObj.id));

        // Sonra animasyonu başlat
        setAnimatingLetter({
          letter: letterObj,
          position,
          index: targetIndex,
          sourceId: letterObj.id
        });

        // Harfi selectedLetters'a ekle
        setTimeout(() => {
          setSelectedLetters(prev => [...prev, letterObj]);

          // Animasyonu temizle
          setTimeout(() => {
            setAnimatingLetter(null);
          }, 300);
        }, 300);
      }
    }
  }, [selectedLetters, playSound]);

  // Seçimi sıfırlama işlemi
  const resetSelection = () => {
    playSound('click');
    setSelectedLetters([]);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
    playSound('click');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if ((draggedIndex !== null) && (draggedIndex !== targetIndex)) {
      const newLetters = [...shuffledLetters];
      const [draggedLetter] = newLetters.splice(draggedIndex, 1);
      newLetters.splice(targetIndex, 0, draggedLetter);
      setShuffledLetters(newLetters);
      playSound('click');
    }
  };

  // Seçilen harfi kaldır ve eski yerine koy
  const handleSelectedLetterClick = (letterObj, index) => {
    playSound('click');
    // Seçili harflerden kaldır
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    // Karıştırılmış harflere geri ekle
    setShuffledLetters(prev => [...prev, letterObj]);
  };

  // İpucu gösterme fonksiyonunu güncelleyelim
  const showHint = useCallback(() => {
    if (hintsLeft > 0 && currentWord) {
      playSound('hint');

      // Doğru kelimeyi al
      const correctWord = currentWord.polish;

      // Şu ana kadar seçilen harflerin doğru olup olmadığını kontrol et
      const currentSelection = selectedLetters.map(l => l.letter).join('');
      const nextLetterIndex = currentSelection.length;

      // Sıradaki doğru harfi bul
      const nextCorrectLetter = correctWord[nextLetterIndex];

      // Karıştırılmış harfler arasından bu harfi bul
      const letterToSelect = shuffledLetters.find(
        l => l.letter === nextCorrectLetter && !selectedLetters.includes(l)
      );

      if (letterToSelect) {
        // Harfin elementini bul
        const letterElement = document.querySelector(`[data-letter-id="${letterToSelect.id}"]`);

        // handleLetterSelect'i doğru parametrelerle çağır
        handleLetterSelect(letterToSelect, letterElement);

        // İpucu hakkını azalt
        setHintsLeft(prev => prev - 1);
      }
    }
  }, [hintsLeft, currentWord, selectedLetters, shuffledLetters, playSound, handleLetterSelect]);

  // Oyunu yeniden başlat
  const handleRestart = () => {
    setScore(0);
    setLives(DIFFICULTY_SETTINGS[difficulty].lives);
    setTimer(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setLevel(1);
    setHintsLeft(DIFFICULTY_SETTINGS[difficulty].hints);
    setCombo(0);
    setGameStatus(null);
    setIsGameOver(false);
    prepareWord();
  };

  // Ses çalma fonksiyonunu ayrı bir handler olarak çıkaralım
  const handlePlayAudio = useCallback(() => {
    if (currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.polish);
      utterance.lang = 'pl-PL';
      window.speechSynthesis.speak(utterance);
      playSound('click');
    }
  }, [currentWord, playSound]);

  // İlk oyun ekranı
  if (isFirstGame) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-lg p-6 rounded-2xl ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-white/50 border-gray-200/50'
          } border backdrop-blur-sm text-center`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kelime Bulmaca
          </h2>

          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Harfleri doğru sıraya dizerek kelimeleri tamamla!
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(DIFFICULTY_SETTINGS).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsFirstGame(false);
                  difficulty = key;
                  setTimer(value.timeLimit);
                  setLives(value.lives);
                  setHintsLeft(value.hints);
                }}
                className={`p-4 rounded-xl ${
                  key === difficulty
                    ? darkMode
                      ? 'bg-violet-500 text-white'
                      : 'bg-violet-500 text-white'
                    : darkMode
                      ? 'bg-gray-700/50 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="text-lg font-medium capitalize">{key}</div>
                <div className="text-sm opacity-75">
                  {value.timeLimit}s / {value.hints} İpucu
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsSoundEnabled(!isSoundEnabled);
                playSound('click');
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                darkMode
                  ? 'bg-gray-700/50 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isSoundEnabled ? (
                <Music size={20} />
              ) : (
                <VolumeX size={20} />
              )}
              {isSoundEnabled ? 'Ses Açık' : 'Ses Kapalı'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 space-y-3 sm:space-y-4 max-w-7xl mx-auto">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <GameHeader
        score={score}
        lives={lives}
        timer={timer}
        level={level}
        hintsLeft={hintsLeft}
        combo={combo}
        darkMode={darkMode}
        onBack={onBack}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => {
          setIsSoundEnabled(!isSoundEnabled);
          playSound('click');
        }}
        onShowTutorial={() => setShowTutorial(true)}
      />

      <div className={`p-2 sm:p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-12rem)]`}>
        {/* Kelime Gösterimi */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className={`text-2xl sm:text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currentWord?.turkish}
          </h2>
          <AudioButton
            word={currentWord}
            onClick={handlePlayAudio}
            darkMode={darkMode}
          />
        </div>

        {/* Seçilen Harfler */}
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
            {Array.from({ length: currentWord?.polish.length || 0 }).map((_, index) => (
              <div
                key={`selected-${index}`}
                data-selected-index={index}
                className="w-full h-full max-w-[80px] max-h-[80px]"
              >
                <LetterTile
                  letter={selectedLetters[index]?.letter || ''}
                  isSelected={true}
                  isCorrect={selectedLetters.length === currentWord?.polish.length}
                  isWrong={currentWord && selectedLetters[index] && selectedLetters[index].letter !== currentWord.polish[index]}
                  darkMode={darkMode}
                  onClick={() => selectedLetters[index] && handleSelectedLetterClick(selectedLetters[index], index)}
                  disabled={!selectedLetters[index]}
                  currentIndex={index}
                  correctLetter={currentWord?.polish[index]} // Doğru harfi gönder
                />
              </div>
            ))}
          </div>

          {/* Harfler */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {shuffledLetters.map((letterObj, index) => (
              <div
                key={letterObj.id}
                data-letter-id={letterObj.id} // Harfin ID'sini ekleyelim
                className="w-full h-full max-w-[80px] max-h-[80px]"
              >
                <LetterTile
                  letter={letterObj.letter}
                  isSelected={selectedLetters.includes(letterObj)}
                  onClick={(e) => !selectedLetters.includes(letterObj) && handleLetterSelect(letterObj, e.currentTarget.parentElement)}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  darkMode={darkMode}
                  isAnimating={animatingLetter?.letter === letterObj}
                  isReturning={animatingLetter?.sourceId === letterObj.id && animatingLetter?.isReturning}
                  position={animatingLetter?.letter === letterObj ? animatingLetter.position : null}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Kontrol Butonları */}
        <div className="flex gap-2 mt-6 w-full max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetSelection}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-red-500/20 text-red-400'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <X size={20} />
            Temizle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={showHint}
            disabled={hintsLeft === 0}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2
              ${hintsLeft > 0
                ? darkMode
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-violet-50 text-violet-600'
                : darkMode
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <HelpCircle size={20} />
            İpucu ({hintsLeft})
          </motion.button>
        </div>
      </div>

      {/* Oyun Sonu Modal */}
      <AnimatePresence>
        {isGameOver && (
          <Modal
            title={gameStatus === 'timeout' ? 'Süre Doldu!' : 'Oyun Bitti!'}
            onClose={handleRestart}
            darkMode={darkMode}
          >
            <div className="space-y-6">
              {/* Skor Özeti */}
              <div className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="grid grid-cols-2 gap-4">
                  <StatItem
                    icon={Trophy}
                    value={score}
                    label="Toplam Puan"
                    iconColor="text-yellow-500"
                  />
                  <StatItem
                    icon={Star}
                    value={level}
                    label="Ulaşılan Seviye"
                    iconColor="text-violet-500"
                  />
                  <StatItem
                    icon={Crown}
                    value={combo}
                    label="En Yüksek Kombo"
                    iconColor="text-emerald-500"
                  />
                  <StatItem
                    icon={Shield}
                    value={hintsLeft}
                    label="Kalan İpucu"
                    iconColor="text-blue-500"
                  />
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3">
                <Button
                  icon={RefreshCw}
                  onClick={handleRestart}
                  variant="primary"
                  className="flex-1"
                >
                  Tekrar Oyna
                </Button>
                <Button
                  icon={Share2}
                  onClick={() => {
                    const text = `Kelime Bulmaca'da ${score} puan yaptım! ${level}. seviyeye ulaştım!`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'Kelime Bulmaca Skorum',
                        text: text
                      });
                    } else {
                      navigator.clipboard.writeText(text);
                    }
                  }}
                  variant="secondary"
                >
                  Paylaş
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialModal
            darkMode={darkMode}
            onClose={() => setShowTutorial(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
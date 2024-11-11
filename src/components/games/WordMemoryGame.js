import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // axios'u import edelim
import Confetti from 'react-confetti';
import {
  Timer, Star, Trophy, Shield, Heart,
  Crown, RefreshCw, Award, Zap, Book,
  Share2, Eye, X, Volume2, ArrowLeft
} from 'lucide-react';

// Ses efektlerini CDN'den yükleyelim
const SOUNDS = {
  flip: new Audio('https://cdn.freesound.org/sounds/368/368691-flip-card.mp3'),
  match: new Audio('https://cdn.freesound.org/sounds/442/442943-match-success.mp3'),
  wrong: new Audio('https://cdn.freesound.org/sounds/442/442944-wrong-buzz.mp3'),
  win: new Audio('https://cdn.freesound.org/sounds/456/456966-win-fanfare.mp3'),
  lose: new Audio('https://cdn.freesound.org/sounds/442/442945-game-over.mp3'),
  levelUp: new Audio('https://cdn.freesound.org/sounds/442/442946-level-up.mp3'),
  powerup: new Audio('https://cdn.freesound.org/sounds/442/442947-power-up.mp3'),
};

// Oyun zorluğu ayarları
const DIFFICULTY_SETTINGS = {
  easy: { pairs: 6, timeLimit: 120, scoreMultiplier: 1 },
  medium: { pairs: 8, timeLimit: 90, scoreMultiplier: 1.5 },
  hard: { pairs: 10, timeLimit: 60, scoreMultiplier: 2 },
  expert: { pairs: 12, timeLimit: 45, scoreMultiplier: 3 }
};

// Güç-up'lar
const POWERUPS = {
  timeFreeze: {
    icon: Timer,
    name: 'Zaman Dondurma',
    description: '15 saniyeliğine süreyi dondurur',
    duration: 15,
    cost: 1000
  },
  revealCards: {
    icon: Eye,
    name: 'Kart Gösterici',
    description: 'Tüm kartları 2 saniye gösterir',
    duration: 2,
    cost: 1500
  },
  extraLife: {
    icon: Heart,
    name: 'Ekstra Can',
    cost: 2000
  },
  doublePoints: {
    icon: Zap,
    name: 'Çift Puan',
    description: '30 saniye boyunca çift puan',
    duration: 30,
    cost: 2500
  }
};

// Başarımlar
const ACHIEVEMENTS = {
  firstWin: {
    id: 'firstWin',
    name: 'İlk Zafer',
    description: 'İlk oyununu tamamla',
    icon: Trophy,
    reward: 500
  },
  comboMaster: {
    id: 'comboMaster',
    name: 'Kombo Ustası',
    description: '5x komboya ulaş',
    icon: Zap,
    reward: 1000
  },
  speedRunner: {
    id: 'speedRunner',
    name: 'Hız Ustası',
    description: 'Bir seviyeyi 30 saniyede tamamla',
    icon: Timer,
    reward: 1500
  },
  perfectMatch: {
    id: 'perfectMatch',
    name: 'Mükemmel Eşleşme',
    description: 'Hiç hata yapmadan bir seviye tamamla',
    icon: Star,
    reward: 2000
  }
};

// Ses çalma yardımcı fonksiyonu
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

// Card bileşenini güncelle
const Card = ({
  word,
  isFlipped,
  isMatched,
  isHighlighted,
  onClick,
  onPlaySound,
  darkMode
}) => {
  const cardVariants = {
    highlighted: {
      scale: [1, 1.1, 1],
      borderColor: ['#8B5CF6', '#EC4899', '#8B5CF6'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Ses çalma fonksiyonu
  const handlePlayAudio = async (e) => {
    e.stopPropagation(); // Kartın çevrilmesini engelle
    if (word.isPolish) {
      await playAudioWithElevenLabs(word.polish);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      animate={isHighlighted ? 'highlighted' : 'initial'}
      whileHover={{ scale: isFlipped ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full h-full relative aspect-square rounded-lg cursor-pointer ${
        isMatched
          ? darkMode
            ? 'bg-emerald-500/20'
            : 'bg-emerald-50'
          : darkMode
          ? 'bg-gray-700/50'
          : 'bg-white'
      } ${
        isFlipped
          ? ''
          : darkMode
          ? 'hover:bg-gray-700'
          : 'hover:bg-gray-50'
      } border-2 ${
        isMatched
          ? 'border-emerald-500'
          : isHighlighted
          ? 'border-violet-500'
          : darkMode
          ? 'border-gray-700'
          : 'border-gray-200'
      } shadow-lg transition-colors`}
      onClick={() => {
        if (!isFlipped && !isMatched) {
          onClick();
          onPlaySound && onPlaySound('flip');
        }
      }}
    >
      <div
        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-0.5 sm:p-1 transition-all duration-300 ${
          isFlipped || isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <span className="text-[10px] leading-none sm:text-xs md:text-sm font-medium text-center w-full px-0.5 sm:px-1 break-words line-clamp-2 overflow-hidden">
          {word.isPolish ? word.polish : word.turkish}
        </span>
        {word.isPolish && (
          <button
            onClick={handlePlayAudio}
            className="mt-0.5 sm:mt-1 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Volume2 size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4 text-violet-500" />
          </button>
        )}
      </div>
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300 ${
          !isFlipped && !isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <span className="text-xl">?</span>
      </div>
    </motion.div>
  );
};

// Yeni bileşen: PowerUp Mağazası
const PowerUpStore = ({ coins, onPurchase, darkMode }) => (
  <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  }`}>
    {Object.entries(POWERUPS).map(([key, powerup]) => (
      <motion.button
        key={key}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onPurchase(key)}
        className={`p-4 rounded-xl ${
          darkMode
            ? 'bg-violet-500/20 hover:bg-violet-500/30'
            : 'bg-violet-50 hover:bg-violet-100'
        } flex flex-col items-center gap-2`}
      >
        <powerup.icon className="w-8 h-8" />
        <div className="text-sm font-medium">{powerup.name}</div>
        <div className="text-xs opacity-75">{powerup.description}</div>
        <div className="mt-2 flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>{powerup.cost}</span>
        </div>
      </motion.button>
    ))}
  </div>
);

// Başarımlar bölümünü düzeltelim
const AchievementsPanel = ({ achievements, darkMode }) => (
  <div className={`space-y-4 p-4 rounded-xl ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  }`}>
    {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
      const AchievementIcon = achievement.icon;
      return (
        <div
          key={key}
          className={`p-4 rounded-xl ${
            achievements.includes(key)
              ? darkMode
                ? 'bg-emerald-500/20'
                : 'bg-emerald-50'
              : darkMode
                ? 'bg-gray-700/50'
                : 'bg-gray-100'
          } flex items-center gap-4`}
        >
          <AchievementIcon
            className={`w-8 h-8 ${
              achievements.includes(key)
                ? 'text-emerald-500'
                : 'opacity-50'
            }`}
          />
          <div>
            <div className="font-medium">{achievement.name}</div>
            <div className="text-sm opacity-75">{achievement.description}</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{achievement.reward}</span>
          </div>
        </div>
      );
    })}
  </div>
);

// GameHeader bileşenini güncelle
const GameHeader = ({
  score,
  lives,
  timer,
  level,
  combo,
  coins,
  darkMode,
  onBack,
  isSoundEnabled,
  onToggleSound,
  onOpenStore,
  activePowerUps
}) => (
  <div className={`p-2 sm:p-3 rounded-xl ${
    darkMode ? 'bg-gray-800/50' : 'bg-white/50'
  } backdrop-blur-sm shadow-lg border border-gray-200/20`}>
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Sol: Kontroller */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onBack}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100/10 active:bg-gray-100/20"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onToggleSound}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100/10 active:bg-gray-100/20"
        >
          <Volume2 
            size={16} 
            className={`sm:w-5 sm:h-5 ${isSoundEnabled ? 'text-violet-500' : 'opacity-50'}`} 
          />
        </button>
      </div>

      {/* Orta: Oyun Metrikleri */}
      <div className="flex-1 grid grid-cols-5 gap-1 sm:gap-2 place-items-center">
        <GameStat
          icon={Timer}
          value={timer}
          suffix="s"
          color="text-orange-500"
          isActive={activePowerUps.timeFreeze?.active}
          remainingTime={activePowerUps.timeFreeze?.remainingTime}
        />
        <GameStat
          icon={Heart}
          value={lives}
          color="text-red-500"
        />
        <GameStat
          icon={Zap}
          value={combo}
          suffix="x"
          color="text-blue-500"
          isActive={activePowerUps.doublePoints?.active}
          remainingTime={activePowerUps.doublePoints?.remainingTime}
        />
        <GameStat
          icon={Star}
          value={level}
          color="text-violet-500"
        />
        <GameStat
          icon={Crown}
          value={score}
          color="text-yellow-500"
        />
      </div>

      {/* Sağ: Coin ve Store */}
      <button
        onClick={onOpenStore}
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg 
        bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 transition-colors"
      >
        <Trophy size={16} className="sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-medium">{coins}</span>
      </button>
    </div>
  </div>
);

// Yeni GameStat bileşeni
const GameStat = ({ icon: Icon, value, suffix = '', color, isActive, remainingTime }) => (
  <div className="relative flex flex-col items-center">
    <div className={`relative p-1.5 sm:p-2 rounded-lg ${
      isActive ? 'bg-violet-500/20' : 'hover:bg-gray-100/10'
    } transition-colors`}>
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      {isActive && remainingTime && (
        <div className="absolute -bottom-1 -right-1 text-[10px] font-medium px-1 py-0.5 
        rounded-full bg-violet-500 text-white">{remainingTime}</div>
      )}
    </div>
    <span className="mt-0.5 text-xs sm:text-sm font-medium">
      {value}{suffix}
    </span>
  </div>
);

// createCards fonksiyonunu güncelle
const createCards = (words, pairCount) => {
  const shuffledWords = [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, pairCount);

  // Her kelime için Lehçe ve Türkçe kartlar oluştur
  const pairs = shuffledWords.map((word, index) => [
    {
      ...word,
      isPolish: true,
      pairId: index
    },
    {
      ...word,
      isPolish: false,
      pairId: index
    }
  ]).flat();

  // Tüm kartları karıştır
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((word, index) => ({
      id: index,
      word
    }));
};

// Yeni bileşen: Celebration
const Celebration = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-violet-500 text-white rounded-lg"
      >
        Tamam
      </button>
    </div>
  </motion.div>
);

// Yeni bileşen: PowerUpCelebration
const PowerUpCelebration = ({ powerUp, onComplete }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000); // 2 saniye sonra yeteneği aktifleştir
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Icon = powerUp.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [180, 0],
          transition: { duration: 0.5 }
        }}
        className={`p-8 rounded-full bg-violet-500 text-white`}
      >
        <Icon size={48} />
      </motion.div>
    </motion.div>
  );
};

// Ana oyun container'ını ve grid sistemini güncelle
export default function WordMemoryGame({
  words = [],
  darkMode = false,
  difficulty = 'medium',
  onGameComplete = () => {},
  onBack = () => {} // Varsayılan boş fonksiyon
}) {
  // isSoundEnabled state'ini üste taşıyalım
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Ses çalma fonksiyonu
  const playSound = useCallback((soundName) => {
    if (isSoundEnabled && SOUNDS[soundName]) {
      SOUNDS[soundName].currentTime = 0;
      SOUNDS[soundName].play().catch(() => {});
    }
  }, [isSoundEnabled]);

  // Mevcut state'lere ek olarak:
  const [coins, setCoins] = useState(2000); // 2000 coin ile başla
  const [activePowerUps, setActivePowerUps] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [statistics, setStatistics] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    bestScore: 0,
    totalMatches: 0,
    perfectLevels: 0,
    fastestLevel: Infinity
  });
  const [showTutorial, setShowTutorial] = useState(true);
  const [showStore, setShowStore] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebratingPowerUp, setCelebratingPowerUp] = useState(null);
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
  const [showInitialCards, setShowInitialCards] = useState(true);
  const [showVideoUnavailable, setShowVideoUnavailable] = useState(false);

  // State tanımlamaları ekleyelim
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(DIFFICULTY_SETTINGS[difficulty].timeLimit);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameCards, setGameCards] = useState([]);

  // Başlangıçta kartları göster ve 5 saniye sonra kapat
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialCards(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // PowerUp'ların efektlerini uygula - Bu fonksiyonu yukarı taşıyoruz
  const applyPowerUpEffect = useCallback((powerUpId) => {
    switch (powerUpId) {
      case 'timeFreeze':
        // Zaman dondurma özelliği zaten timer useEffect'inde kontrol ediliyor
        break;
      case 'revealCards':
        // Kartları göster özelliği zaten Card bileşeninde kontrol ediliyor
        break;
      case 'extraLife':
        setLives(prev => Math.min(prev + 1, 5)); // Maximum 5 can
        break;
      case 'doublePoints':
        // Çift puan özelliği zaten handleCardClick'te kontrol ediliyor
        break;
      default:
        break;
    }
  }, []);

  // PowerUp satın alma
  const handlePurchasePowerUp = useCallback((powerUpId) => {
    const powerUp = POWERUPS[powerUpId];

    // Coin kontrolü
    if (coins < powerUp.cost) {
      setSelectedPowerUp(powerUp);
      setShowInsufficientCoinsModal(true);
      return;
    }

    // Coini düş
    setCoins(prev => prev - powerUp.cost);

    setShowStore(false); // Mağazayı kapat

    // Kutlama animasyonunu göster
    setCelebratingPowerUp(powerUp);

  }, [coins]);

  // Kutlama tamamlandığında çağrılacak fonksiyon
  const handleCelebrationComplete = useCallback(() => {
    if (celebratingPowerUp) {
      const powerUpId = Object.keys(POWERUPS).find(
        key => POWERUPS[key] === celebratingPowerUp
      );

      setActivePowerUps(prev => ({
        ...prev,
        [powerUpId]: {
          active: true,
          remainingTime: celebratingPowerUp.duration || 0
        }
      }));

      // PowerUp efektini uygula
      applyPowerUpEffect(powerUpId);

      if (isSoundEnabled) playSound('powerup');
      setCelebratingPowerUp(null);
    }
  }, [celebratingPowerUp, isSoundEnabled, playSound, applyPowerUpEffect]);

  // Başarım kontrolü
  const checkAchievements = useCallback(() => {
    const newAchievements = [];

    // İlk oyun başarımı
    if (!achievements.includes('firstWin') && statistics.gamesPlayed === 1) {
      newAchievements.push('firstWin');
    }

    // Kombo başarımı
    if (!achievements.includes('comboMaster') && combo >= 5) {
      newAchievements.push('comboMaster');
    }

    // Diğer başarım kontrolleri...

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      // Başarım ödüllerini ver
      const totalReward = newAchievements.reduce(
        (sum, id) => sum + ACHIEVEMENTS[id].reward, 0
      );
      setCoins(prev => prev + totalReward);
    }
  }, [achievements, statistics.gamesPlayed, combo]);

  // İstatistikleri güncelle
  const updateStatistics = useCallback((gameResult) => {
    setStatistics(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + gameResult.score,
      bestScore: Math.max(prev.bestScore, gameResult.score),
      totalMatches: prev.totalMatches + gameResult.matches,
      perfectLevels: prev.perfectLevels + (gameResult.mistakes === 0 ? 1 : 0),
      fastestLevel: Math.min(prev.fastestLevel, gameResult.time)
    }));
  }, []);

  // Oyun sonu
  useEffect(() => {
    if (isGameOver) {
      const gameResult = {
        score,
        matches: matchedPairs.length,
        mistakes: 3 - lives,
        time: DIFFICULTY_SETTINGS[difficulty].timeLimit - timer
      };

      updateStatistics(gameResult);
      checkAchievements();

      // Skor bazlı coin kazanma
      const earnedCoins = Math.floor(score / 100);
      setCoins(prev => prev + earnedCoins);
    }
  }, [isGameOver, score, matchedPairs.length, lives, timer, difficulty, updateStatistics, checkAchievements]);

  // PowerUp efektlerini yönet
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePowerUps(prev => {
        const updated = { ...prev };
        Object.entries(updated).forEach(([id, powerUp]) => {
          if (powerUp.active && powerUp.remainingTime > 0) {
            updated[id] = {
              ...powerUp,
              remainingTime: powerUp.remainingTime - 1
            };
          } else if (powerUp.active) {
            updated[id] = { active: false, remainingTime: 0 };
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ana oyun döngüsünü güncelle
  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(() => {
        if (!activePowerUps.timeFreeze?.active) {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setGameStatus('timeout');
              setIsGameOver(true);
              if (isSoundEnabled) playSound('lose');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameOver, activePowerUps.timeFreeze, isSoundEnabled, playSound]);

  // Kart tıklama işleyicisi
  const handleCardClick = useCallback(async (index) => {
    if (flippedIndexes.length === 2 || isGameOver) return;

    setFlippedIndexes(prev => [...prev, index]);

    const clickedCard = gameCards[index];
    if (clickedCard.word.isPolish) {
      await playAudioWithElevenLabs(clickedCard.word.polish);
    }

    if (flippedIndexes.length === 1) {
      const firstCard = gameCards[flippedIndexes[0]];
      const secondCard = gameCards[index];

      if (firstCard.word.pairId === secondCard.word.pairId) {
        setMatchedPairs(prev => [...prev, firstCard.word.pairId]);
        setScore(prev => prev + (100 * (activePowerUps.doublePoints?.active ? 2 : 1)));
        setCombo(prev => prev + 1);
        playSound('match');

        // Tüm kartlar eşleşti mi kontrol et
        if (matchedPairs.length + 1 === DIFFICULTY_SETTINGS[difficulty].pairs) {
          setGameStatus('won');
          setIsGameOver(true);
          playSound('win');
        }
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
          setLives(prev => prev - 1);
          setCombo(0);
          playSound('wrong');

          if (lives <= 1) {
            setGameStatus('lost');
            setIsGameOver(true);
            playSound('lose');
          }
        }, 1000);
      }

      setTimeout(() => {
        setFlippedIndexes([]);
      }, 1000);
    }
  }, [flippedIndexes, gameCards, isGameOver, lives, matchedPairs.length, difficulty, activePowerUps.doublePoints, playSound]);


  // Yeniden başlatma işleyicisi
  const handleRestart = useCallback(() => {
    setIsGameOver(false);
    setGameStatus(null);
    setScore(0);
    setLevel(1);
    setCombo(0);
    setLives(3);
    setTimer(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setFlippedIndexes([]);
    setMatchedPairs([]);

    // Yeni kartları oluştur
    const cards = createCards(words, DIFFICULTY_SETTINGS[difficulty].pairs);
    setGameCards(cards);
  }, [difficulty, words]);

  // Başlangıç kartlarını oluşturalım
  useEffect(() => {
    const cards = createCards(words, DIFFICULTY_SETTINGS[difficulty].pairs);
    setGameCards(cards);
    setMatchedPairs([]);
    setFlippedIndexes([]);
  }, [words, difficulty]);

  // Video izleme ödülü
  const handleWatchAd = useCallback(() => {
    setShowInsufficientCoinsModal(false);
    setShowVideoUnavailable(true);
  }, []);

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 space-y-3 sm:space-y-4 max-w-7xl mx-auto">
      <GameHeader
        score={score}
        lives={lives}
        timer={timer}
        level={level}
        combo={combo}
        coins={coins}
        darkMode={darkMode}
        onBack={onBack}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => {
          setIsSoundEnabled(!isSoundEnabled);
          playSound('flip');
        }}
        onOpenStore={() => setShowStore(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        activePowerUps={activePowerUps}
      />

      <div className={`p-2 sm:p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-sm h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] flex items-center justify-center overflow-hidden`}>
        <div className="w-full h-full grid grid-cols-4 gap-2 sm:gap-3 place-items-center max-w-4xl mx-auto">
          {gameCards.slice(0, 16).map((card, index) => (
            <div className="w-full h-full max-w-[80px] max-h-[80px] sm:max-w-[100px] sm:max-h-[100px] md:max-w-[120px] md:max-h-[120px]">
              <Card
                key={card.id}
                word={card.word}
                isFlipped={
                  showInitialCards || // Başlangıçta kartları göster
                  flippedIndexes.includes(index) ||
                  matchedPairs.includes(card.word.pairId) ||
                  activePowerUps.revealCards?.active
                }
                isMatched={matchedPairs.includes(card.word.pairId)}
                isHighlighted={activePowerUps.doublePoints?.active}
                onClick={() => !showInitialCards && handleCardClick(index)} // Başlangıç gösterimi sırasında tıklamayı engelle
                onPlaySound={playSound}
                darkMode={darkMode}
              />
            </div>
          ))}
        </div>
      </div>

      {/* PowerUp Mağazası Modal */}
      <AnimatePresence>
        {showStore && (
          <Modal
            title="Güç-Up Mağazası"
            onClose={() => setShowStore(false)}
            darkMode={darkMode}
          >
            <PowerUpStore
              coins={coins}
              onPurchase={handlePurchasePowerUp}
              darkMode={darkMode}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Başarımlar Modal */}
      <AnimatePresence>
        {showAchievements && (
          <Modal
            title="Başarımlar"onClose={() => setShowAchievements(false)}
            darkMode={darkMode}
          >
            <AchievementsPanel
              achievements={achievements}
              darkMode={darkMode}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <Modal
            title="Nasıl Oynanır?"
            onClose={() => setShowTutorial(false)}
            darkMode={darkMode}
          >
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Temel Oynanış
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Kartları çevirerek eşleştirmeye çalışın</li>
                  <li>• Her eşleşme için puan kazanın</li>
                  <li>• Kombo yaparak puanınızı katlayın</li>
                  <li>• Süreniz dolmadan tüm kartları eşleştirin</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Güç-Up'lar
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Kazandığınız coinlerle güç-up'lar satın alın</li>
                  <li>• Zamanı dondurun veya kartları geçici olarak gösterin</li>
                  <li>• Ekstra can kazanın</li>
                  <li>• Çift puan bonusu alın</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Başarımlar
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Özel hedefleri tamamlayarak başarımlar kazanın</li>
                  <li>• Her başarım için ekstra coin ödülü alın</li>
                  <li>• Başarımlarınızı arkadaşlarınızla paylaşın</li>
                </ul>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Yeni Oyun Sonu Modal */}
      <AnimatePresence>
        {isGameOver && (
          <Modal
            title={gameStatus === 'timeout' ? 'Süre Doldu!' : 'Oyun Bitti!'}
            onClose={handleRestart}
            darkMode={darkMode}
          >
            <div className="space-y-6">
              {/* Skor özeti */}
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
                    value={matchedPairs.length}
                    label="Eşleştirilen Çift"
                    iconColor="text-emerald-500"
                  />
                  <StatItem
                    icon={Shield}
                    value={combo}
                    label="En Yüksek Kombo"
                    iconColor="text-blue-500"
                  />
                </div>
              </div>

              {/* Kazanılan Başarımlar */}
              {achievements.length > 0 && (
                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <h3 className="font-medium mb-3">Kazanılan Başarımlar</h3>
                  <div className="space-y-2">
                    {achievements.map(id => {
                      const AchievementIcon = ACHIEVEMENTS[id].icon;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <AchievementIcon className="w-4 h-4 text-emerald-500" />
                          <span>{ACHIEVEMENTS[id].name}</span>
                          <span className="ml-auto flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            {ACHIEVEMENTS[id].reward}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* İstatistikler */}
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <h3 className="font-medium mb-3">Oyun İstatistikleri</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Toplam Oyun:</span>
                    <span>{statistics.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>En Yüksek Skor:</span>
                    <span>{statistics.bestScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Eşleşme:</span>
                    <span>{statistics.totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mükemmel Level:</span>
                    <span>{statistics.perfectLevels}</span>
                  </div>
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
                    // Paylaşım fonksiyonelliği
                    const text = `Kelime Hafıza Oyununda ${score} puan yaptım! ${level}. seviyeye ulaştım!`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'Kelime Hafıza Oyunu Skorum',
                        text: text
                      });
                    } else {
                      navigator.clipboard.writeText(text);
                      // Toast göster
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

      {/* Kutlama Animasyonu */}
      <AnimatePresence>
        {showCelebration && (
          <Celebration
            message={celebrationMessage}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      {/* PowerUp Kutlama Animasyonu */}
      <AnimatePresence>
        {celebratingPowerUp && (
          <PowerUpCelebration
            powerUp={celebratingPowerUp}
            onComplete={handleCelebrationComplete}
          />
        )}
      </AnimatePresence>

      {/* Yetersiz Coin Bildirimi */}
      <AnimatePresence>
        {showInsufficientCoinsModal && (
          <InsufficientCoinsModal
            powerUp={selectedPowerUp}
            darkMode={darkMode}
            onClose={() => setShowInsufficientCoinsModal(false)}
            onWatchAd={handleWatchAd}
          />
        )}
      </AnimatePresence>

      {/* Video Kullanılamıyor Bildirimi */}
      <AnimatePresence>
        {showVideoUnavailable && (
          <VideoUnavailableModal
            darkMode={darkMode}
            onClose={() => setShowVideoUnavailable(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Yardımcı Bileşenler
const Modal = ({ title, children, onClose, darkMode }) => (
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

const Button = ({ children, icon: Icon, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-violet-500 hover:bg-violet-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`py-3 rounded-xl flex items-center justify-center gap-2 font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
};

const StatItem = ({ icon: Icon, value, label, iconColor }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-2 mb-1">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <p className="text-sm opacity-75">{label}</p>
  </div>
);

// InsufficientCoinsModal bileşenini ekleyelim (Modal bileşeninden önce)
const InsufficientCoinsModal = ({ powerUp, onClose, onWatchAd, darkMode }) => (
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
      className={`w-full max-w-sm p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-xl`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <div>
          <h3 className="text-xl font-bold mb-2">Yetersiz Coin!</h3>
          <p className="text-sm opacity-75">
            {powerUp.name} satın almak için {powerUp.cost} coin gerekiyor.
            Video izleyerek coin kazanabilirsiniz!
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Çık
          </Button>
          <Button
            variant="primary"
            onClick={onWatchAd}
            className="flex-1"
          >
            Video İzle
          </Button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Video izleme bildirimini ekleyelim
const VideoUnavailableModal = ({ onClose, darkMode }) => (
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
      className={`w-full max-w-sm p-6 rounded-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-xl`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <Zap className="w-16 h-16 text-violet-500" />
        <div>
          <h3 className="text-xl font-bold mb-2">Video Kullanılamıyor</h3>
          <p className="text-sm opacity-75">
            Şu an için izlenebilecek video bulunmuyor. Lütfen daha sonra tekrar deneyin!
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onClose}
          className="w-full"
        >
          Tamam
        </Button>
      </div>
    </motion.div>
  </motion.div>
);
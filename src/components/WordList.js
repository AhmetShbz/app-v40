import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Bookmark,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// playAudioWithElevenLabs fonksiyonu
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

// iOS tarzı kelime kartı
const WordCard = React.memo(({
  word,
  darkMode,
  isExpanded,
  toggleWordExpand,
  playAudio,
  handleCategoryClick,
  categories,
  activeCategory,
  getCategoryButtonStyles,
  categoryIcons,
  difficultyColors
}) => {
  const currentActiveCategory = activeCategory[word.polish];

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl overflow-hidden backdrop-blur-sm border ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } transition-all duration-300`}
      style={{
        background: darkMode
          ? 'linear-gradient(145deg, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.7))'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.9))'
      }}
    >
      <div className="relative p-4">
        {/* Zorluk Seviyesi Badge */}
        <div className="absolute -top-1 -right-1">
          <div className={`px-2 py-0.5 rounded-bl-xl rounded-tr-xl text-xs font-semibold
            ${difficultyColors[word.difficulty]} shadow-lg`}
          >
            {word.difficulty}
          </div>
        </div>

        {/* Kelime ve Kontroller */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {word.polish}
            </motion.h3>
            <div className="flex items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => playAudio(word, 'word')}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'bg-violet-500/20 text-violet-400 active:bg-violet-500/30'
                    : 'bg-violet-50 text-violet-600 active:bg-violet-100'
                }`}
              >
                <Volume2 size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWordExpand(word.polish)}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700/50 text-gray-300 active:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </motion.button>
            </div>
          </div>

          {/* Çeviri */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-3 text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {word.turkish}
          </motion.p>

          {/* Kategori Butonları */}
          <div className="flex gap-1.5">
            {categories.map((category) => {
              const isActive = currentActiveCategory === category;
              const Icon = categoryIcons[category].icon;

              return (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCategoryClick(word, category)}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive
                      ? darkMode
                        ? 'ring-1 ring-violet-500 ring-offset-1 ring-offset-gray-800'
                        : 'ring-1 ring-violet-500 ring-offset-1'
                      : ''
                  } ${getCategoryButtonStyles(category, isActive, darkMode)}`}
                  title={category}
                >
                  <Icon size={16} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Genişletilmiş İçerik */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`border-t ${
              darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}
          >
            <div className="p-4 space-y-3">
              {/* Fonetik */}
              <div className={`p-3 rounded-xl backdrop-blur-sm ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center mb-1.5">
                  <Bookmark className={`mr-2 ${
                    darkMode ? 'text-violet-400' : 'text-violet-600'
                  }`} size={16} />
                  <span className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Fonetik:
                  </span>
                </div>
                <p className={`text-sm italic ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {word.phonetic}
                </p>
              </div>

              {/* Örnek Cümle */}
              <div className={`p-3 rounded-xl backdrop-blur-sm ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center">
                    <Bookmark className={`mr-2 ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} size={16} />
                    <span className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Örnek Cümle:
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playAudio(word, 'sentence')}
                    className={`p-1.5 rounded-lg ${
                      darkMode
                        ? 'bg-violet-500/20 text-violet-400 active:bg-violet-500/30'
                        : 'bg-violet-50 text-violet-600 active:bg-violet-100'
                    }`}
                  >
                    <Volume2 size={14} />
                  </motion.button>
                </div>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {word.example}
                </p>
              </div>

              {/* Çeviri */}
              <div className={`p-3 rounded-xl backdrop-blur-sm ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'
              }`}>
                <div className="flex items-center mb-1.5">
                  <Bookmark className={`mr-2 ${
                    darkMode ? 'text-amber-400' : 'text-amber-600'
                  }`} size={16} />
                  <span className={`text-sm font-semibold ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Çeviri:
                  </span>
                </div>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {word.translation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// iOS tarzı liste başlığı
const ListHeader = React.memo(({ filter, onFilterChange, darkMode, onSearch }) => (
  <div className={`sticky top-0 z-50 ${
    darkMode ? 'bg-gray-900/70' : 'bg-white/70'
  } backdrop-blur-lg border-b ${
    darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
  }`}>
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen
          className={darkMode ? 'text-violet-400' : 'text-violet-600'}
          size={24}
        />
        <div>
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Kelimelerim
          </h2>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Tüm kelimelerinizi yönetin ve öğrenin
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Arama Çubuğu */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white/50 border-gray-200'
          }`}>
            <Search
              size={18}
              className={darkMode ? 'text-gray-400' : 'text-gray-500'}
            />
            <input
              type="text"
              placeholder="Kelime ara..."
              onChange={(e) => onSearch(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-sm ${
                darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Filtre Seçimi */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
          darkMode
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white/50 border-gray-200'
        }`}>
          <Filter
            size={18}
            className={darkMode ? 'text-gray-400' : 'text-gray-500'}
          />
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className={`flex-1 bg-transparent border-none outline-none text-sm appearance-none ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <option value="all">Tüm Seviyeler</option>
            <option value="Kolay">Kolay</option>
            <option value="Orta">Orta</option>
            <option value="Zor">Zor</option>
          </select>
        </div>
      </div>
    </div>
  </div>
));

// iOS tarzı sayfalama
const Pagination = React.memo(({
  currentPage,
  totalPages,
  onPageChange,
  darkMode
}) => {
  return (
    <div className={`sticky bottom-0 ${
      darkMode ? 'bg-gray-900/70' : 'bg-white/70'
    } backdrop-blur-lg border-t ${
      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
    } px-4 py-3`}>
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium ${
            darkMode
              ? 'bg-gray-800 text-gray-300 active:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600'
              : 'bg-gray-100 text-gray-700 active:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400'
          }`}
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Önceki</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
          }`}>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Sayfa
            </span>
            <select
              value={currentPage}
              onChange={(e) => onPageChange(Number(e.target.value))}
              className={`appearance-none bg-transparent font-medium focus:outline-none ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {[...Array(totalPages)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              / {totalPages}
            </span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium ${
            darkMode
              ? 'bg-gray-800 text-gray-300 active:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600'
              : 'bg-gray-100 text-gray-700 active:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400'
          }`}
        >
          <span className="hidden sm:inline">Sonraki</span>
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
});

// Ana WordList Bileşeni
const WordList = React.memo(({
  words,
  categories,
  addToCategory,
  darkMode
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWords, setExpandedWords] = useState({});
  const [localWords, setLocalWords] = useState(words);
  const [activeCategory, setActiveCategory] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const wordsPerPage = 8; // Mobil için daha az kelime gösteriyoruz

  useEffect(() => {
    setLocalWords(words);
  }, [words]);

  // Filtreleme, Arama ve Sayfalama İşlemleri
  const filteredWords = useMemo(() => {
    return localWords
      .filter(word => {
        const matchesFilter = filter === 'all' || word.difficulty === filter;
        const matchesSearch = searchQuery
          ? word.polish.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.turkish.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        return matchesFilter && matchesSearch;
      });
  }, [localWords, filter, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredWords.length / wordsPerPage);
  }, [filteredWords, wordsPerPage]);

  const currentWords = useMemo(() => {
    const startIndex = (currentPage - 1) * wordsPerPage;
    return filteredWords.slice(startIndex, startIndex + wordsPerPage);
  }, [filteredWords, currentPage, wordsPerPage]);

  // İşleyici Fonksiyonlar
  const handlePageChange = useCallback((pageNumber) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    setTimeout(() => setIsLoading(false), 300);
    // Sayfanın en üstüne scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const playAudio = useCallback((word, type) => {
    const text = type === 'word' ? word.polish : word.example;
    playAudioWithElevenLabs(text);
  }, []);

  const toggleWordExpand = useCallback((wordId) => {
    setExpandedWords((prev) => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  }, []);

  const handleCategoryClick = useCallback((word, category) => {
    // Haptic feedback (iOS)
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    addToCategory(word, category);
    setActiveCategory((prev) => ({
      ...prev,
      [word.polish]: category
    }));
    setLocalWords((prevWords) =>
      prevWords.map((w) =>
        w.polish === word.polish
          ? { ...w, category: category }
          : w
      )
    );
  }, [addToCategory]);

  // Sabit Veriler
  const categoryIcons = useMemo(() => ({
    'Öğrendiğim Kelimeler': {
      icon: CheckCircle,
      color: '#10B981'
    },
    'Zorlandığım Kelimeler': {
      icon: XCircle,
      color: '#EF4444'
    },
    'Tekrar Edilecek Kelimeler': {
      icon: RefreshCw,
      color: '#F59E0B'
    }
  }), []);

  const difficultyColors = useMemo(() => ({
    Kolay: 'bg-emerald-500/20 text-emerald-500 dark:bg-emerald-500/30 dark:text-emerald-300',
    Orta: 'bg-amber-500/20 text-amber-500 dark:bg-amber-500/30 dark:text-amber-300',
    Zor: 'bg-red-500/20 text-red-500 dark:bg-red-500/30 dark:text-red-300'
  }), []);

  const getCategoryButtonStyles = useCallback((category, isActive, isDarkMode) => {
    const color = categoryIcons[category].color;
    const baseStyle = `transition-all duration-300 backdrop-blur-sm`;
    const opacity = isDarkMode ? (isActive ? '30' : '20') : (isActive ? '20' : '10');
    const hoverOpacity = isDarkMode ? '25' : '15';

    return `${baseStyle} bg-opacity-${opacity} bg-${color} text-${color}-${isDarkMode ? '400' : '700'} active:bg-opacity-${hoverOpacity}`;
  }, [categoryIcons]);

  return (
    <div className="relative min-h-screen pb-[60px]">
      {/* Header */}
      <ListHeader
        filter={filter}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        darkMode={darkMode}
      />

      {/* Kelime Kartları */}
      <motion.div
        initial={false}
        animate={isLoading ? { opacity: 0.5 } : { opacity: 1 }}
        className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2"
      >
        <AnimatePresence mode="wait">
          {currentWords.map((word) => (
            <motion.div
              key={word.polish}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <WordCard
                word={word}
                darkMode={darkMode}
                isExpanded={expandedWords[word.polish]}
                toggleWordExpand={toggleWordExpand}
                playAudio={playAudio}
                handleCategoryClick={handleCategoryClick}
                categories={categories}
                activeCategory={activeCategory}
                getCategoryButtonStyles={getCategoryButtonStyles}
                categoryIcons={categoryIcons}
                difficultyColors={difficultyColors}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Sayfa Boşsa */}
      {filteredWords.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl mb-4 ${
              darkMode
                ? 'bg-gray-800/50 text-gray-300'
                : 'bg-gray-100/50 text-gray-600'
            }`}
          >
            <Search size={32} />
          </motion.div>
          <p className={`text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Aramanıza uygun kelime bulunamadı
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredWords.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          darkMode={darkMode}
        />
      )}

      <style jsx global>{`
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
        }
      `}</style>
    </div>
  );
});

export default WordList;
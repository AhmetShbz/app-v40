import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Puzzle,
  Timer,
  Swords,
  Car,
  Trophy,
  Star,
  Medal,
  Crown,
  Shield,
  ArrowLeft // ArrowLeft ikonunu ekledik
} from 'lucide-react';

const games = [
  {
    id: 'memory',
    title: 'Hafıza Oyunu',
    description: 'Eşleşen kelime çiftlerini bul',
    icon: Brain,
    color: 'violet',
    path: '/games/memory',
    difficulty: 'Orta'
  },
  {
    id: 'puzzle',
    title: 'Kelime Bulmaca',
    description: 'Harfleri doğru sıraya diz',
    icon: Puzzle,
    color: 'blue',
    path: '/games/puzzle',
    difficulty: 'Kolay'
  },
  {
    id: 'duel',
    title: 'Kelime Düellosu',
    description: 'Özel güçlerle rakiplerini yen',
    icon: Swords,
    color: 'orange',
    path: '/games/duel',
    difficulty: 'Zor'
  },
  {
    id: 'racing',
    title: 'Kelime Yarışı',
    description: 'Hızlı çeviri yarışına katıl',
    icon: Car,
    color: 'emerald',
    path: '/games/racing',
    difficulty: 'Orta'
  }
];

const GameCard = ({ game, darkMode }) => {
  const navigate = useNavigate();
  const Icon = game.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(game.path)}
      className={`p-6 rounded-2xl cursor-pointer ${
        darkMode
          ? 'bg-gray-800/50 hover:bg-gray-800 border-gray-700/50'
          : 'bg-white/50 hover:bg-white border-gray-200/50'
      } border backdrop-blur-sm transition-colors`}
    >
      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center
        ${darkMode ? `bg-${game.color}-500/20` : `bg-${game.color}-50`}`}
      >
        <Icon className={`w-6 h-6 text-${game.color}-${darkMode ? '400' : '500'}`} />
      </div>

      <h3 className={`text-lg font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {game.title}
      </h3>

      <p className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {game.description}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium
          ${darkMode
            ? 'bg-violet-500/20 text-violet-400'
            : 'bg-violet-50 text-violet-600'
          }`}
        >
          En Yüksek: 2500
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium
          ${darkMode
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {game.difficulty}
        </div>
      </div>
    </motion.div>
  );
};

const GamesHub = ({ darkMode }) => {
  const navigate = useNavigate(); // Eklendi - üst kısımda kullanacağız

  return (
    <div className="p-4 space-y-6">
      {/* Header - güncellendi */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
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

        <h1 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Oyunlar
        </h1>

        <div className="w-[76px]" /> {/* Boşluk için dengeleyici */}
      </div>

      {/* Header Stats */}
      <div className={`p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-sm`}>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Trophy className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
            <div>
              <div className="text-xs opacity-60">Toplam Puan</div>
              <div className="font-bold">12,500</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className={darkMode ? 'text-violet-400' : 'text-violet-500'} />
            <div>
              <div className="text-xs opacity-60">Başarı</div>
              <div className="font-bold">15/20</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Medal className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
            <div>
              <div className="text-xs opacity-60">Seviye</div>
              <div className="font-bold">8</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Crown className={darkMode ? 'text-amber-400' : 'text-amber-500'} />
            <div>
              <div className="text-xs opacity-60">Sıralama</div>
              <div className="font-bold">#12</div>
            </div>
          </div>
        </div>
      </div>

      {/* Oyun Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Global Sıralama */}
      <div className={`p-4 rounded-2xl ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50'
          : 'bg-white/50 border-gray-200/50'
      } border backdrop-blur-sm`}>
        <h3 className={`text-lg font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Global Sıralama
        </h3>

        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl flex items-center justify-between ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${i === 0
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : i === 1
                      ? 'bg-gray-500/20 text-gray-500'
                      : i === 2
                        ? 'bg-amber-500/20 text-amber-500'
                        : darkMode
                          ? 'bg-gray-600/50 text-gray-400'
                          : 'bg-gray-200/50 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="font-medium">Kullanıcı {i + 1}</span>
              </div>
              <div className="font-bold">
                {25000 - (i * 2500)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop görsel efekt */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[30rem] w-[30rem] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          </div>
        </div>
        <div className="absolute inset-0 backdrop-blur-xl" />
      </div>
    </div>
  );
};

export default GamesHub;
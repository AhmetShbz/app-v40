import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Area,
  Legend,
} from 'recharts';
import {
  Award,
  RefreshCw,
  Calendar,
  Target,
  Brain,
  Clock,
  BarChart2,
  TrendingUp,
  Star,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryWordsPopup from './CategoryWordsPopup';

// Gradient ve renk tanımlamaları
const createGradient = (color) => ({
  light: {
    start: `${color}15`,
    middle: `${color}30`,
    end: `${color}50`
  },
  dark: {
    start: `${color}30`,
    middle: `${color}50`,
    end: `${color}70`
  }
});

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  gray: '#6B7280'
};

const GRADIENTS = {
  primary: createGradient(COLORS.primary),
  success: createGradient(COLORS.success),
  warning: createGradient(COLORS.warning),
  danger: createGradient(COLORS.danger),
  info: createGradient(COLORS.info)
};

// Custom Tooltip komponenti
const CustomTooltip = React.memo(({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`px-3 py-2 rounded-xl shadow-xl backdrop-blur-md
          ${darkMode
            ? 'bg-gray-800/90 border border-gray-700/50'
            : 'bg-white/90 border border-gray-200/50'
          }`}
        style={{ maxWidth: '200px' }}
      >
        <div className={`text-xs font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className={`text-sm font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {payload[0].value}
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
});

// Custom Legend komponenti
const CustomLegend = React.memo(({ payload, darkMode }) => (
  <motion.div
    className="flex flex-wrap justify-center gap-2 mt-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {payload.map((entry, index) => (
      <motion.div
        key={`legend-${index}`}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center px-2 py-1 rounded-lg backdrop-blur-sm
          ${darkMode
            ? 'bg-gray-700/50 active:bg-gray-700 border border-gray-600/50'
            : 'bg-gray-50 active:bg-gray-100 border border-gray-200/50'
          } transition-all duration-200`}
      >
        <div
          className="w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: entry.payload.color }}
        />
        <span className={`text-xs font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {entry.value}
        </span>
      </motion.div>
    ))}
  </motion.div>
));

// iOS tarzı sayfa başlığı komponenti
const PageHeader = React.memo(({ title, subtitle, darkMode, onBack }) => (
  <div className={`sticky top-0 z-50 ${
    darkMode ? 'bg-gray-900/70' : 'bg-white/70'
  } backdrop-blur-lg border-b ${
    darkMode ? 'border-gray-800' : 'border-gray-200'
  } px-4 py-3`}>
    <div className="flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${
            darkMode
              ? 'hover:bg-gray-800 text-white'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div>
        <h1 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
));

// iOS tarzı stat kartı
const StatCard = React.memo(({ icon: Icon, title, value, subtitle, color, onClick, darkMode, trend }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    className={`p-4 rounded-2xl cursor-pointer backdrop-blur-lg border ${
      darkMode
        ? 'bg-white/5 border-white/10 active:bg-white/10'
        : 'bg-white/80 border-gray-200/50 active:bg-white/90'
    } transition-all duration-300 relative overflow-hidden`}
    onClick={onClick}
  >
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2 rounded-xl ${
            darkMode ? 'bg-white/10' : 'bg-white'
          }`}
        >
          <Icon color={color} size={20} />
        </div>
        {trend !== undefined && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
              ${trend > 0
                ? darkMode
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-600'
                : darkMode
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-red-50 text-red-600'
              }`}
          >
            <TrendingUp
              size={12}
              className={trend > 0 ? 'rotate-0' : 'rotate-180'}
            />
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>

      <div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-2xl font-bold mb-1`}
          style={{ color }}
        >
          {value}
        </motion.p>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm font-medium ${
            darkMode ? 'text-white/90' : 'text-gray-700'
          }`}
        >
          {title}
        </motion.p>

        {subtitle && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xs mt-1 ${
              darkMode ? 'text-white/60' : 'text-gray-500'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  </motion.div>
));

// iOS tarzı sekme geçişi
const TabButton = React.memo(({ active, icon: Icon, label, onClick, darkMode }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-1 items-center justify-center gap-2 py-2 rounded-xl
      ${active
        ? darkMode
          ? 'bg-violet-500/20 text-violet-300'
          : 'bg-violet-50 text-violet-600'
        : darkMode
          ? 'text-white/60'
          : 'text-gray-600'
      }`}
  >
    <Icon size={16} />
    <span className="text-xs font-medium">{label}</span>
  </motion.button>
));

// Grafik Komponentleri
const MemoizedBarChart = React.memo(({ data, darkMode }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart
      data={data}
      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
        vertical={false}
      />
      <XAxis
        dataKey="name"
        stroke={darkMode ? '#D1D5DB' : '#4B5563'}
        tick={{
          fill: darkMode ? '#D1D5DB' : '#4B5563',
          fontSize: 10,
          fontWeight: 500
        }}
        axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />
      <YAxis
        stroke={darkMode ? '#D1D5DB' : '#4B5563'}
        tick={{
          fill: darkMode ? '#D1D5DB' : '#4B5563',
          fontSize: 10,
          fontWeight: 500
        }}
        axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />
      <Tooltip
        content={<CustomTooltip darkMode={darkMode} />}
        cursor={{ fill: 'transparent' }}
      />
      <Bar
        dataKey="value"
        radius={[6, 6, 0, 0]}
        maxBarSize={40}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color}
            style={{
              filter: 'brightness(1.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
));

const MemoizedPieChart = React.memo(({ data, darkMode }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={4}
        dataKey="value"
        startAngle={90}
        endAngle={450}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color}
            style={{
              filter: 'brightness(1.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
      <Legend content={<CustomLegend darkMode={darkMode} />} />
    </PieChart>
  </ResponsiveContainer>
));

const MemoizedLineChart = React.memo(({ data, darkMode }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart
      data={data}
      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
        vertical={false}
      />
      <XAxis
        dataKey="date"
        stroke={darkMode ? '#D1D5DB' : '#4B5563'}
        tick={{
          fill: darkMode ? '#D1D5DB' : '#4B5563',
          fontSize: 10,
          fontWeight: 500
        }}
        axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />
      <YAxis
        stroke={darkMode ? '#D1D5DB' : '#4B5563'}
        tick={{
          fill: darkMode ? '#D1D5DB' : '#4B5563',
          fontSize: 10,
          fontWeight: 500
        }}
        axisLine={{ stroke: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />
      <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
      <Area
        type="monotone"
        dataKey="learned"
        stroke={COLORS.success}
        fill={COLORS.success}
        fillOpacity={0.2}
        strokeWidth={2}
        dot={{
          r: 4,
          strokeWidth: 2,
          fill: darkMode ? '#1F2937' : '#FFFFFF',
          stroke: COLORS.success
        }}
        activeDot={{
          r: 6,
          strokeWidth: 2,
          fill: darkMode ? '#1F2937' : '#FFFFFF',
          stroke: COLORS.success
        }}
      />
    </LineChart>
  </ResponsiveContainer>
));

// Progress Ring komponenti
const ProgressRing = React.memo(({ progress, size = 120, strokeWidth = 6, color, darkMode }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          style={{ filter: 'brightness(1.1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {progress}%
        </motion.span>
        <span className={`text-xs ${
          darkMode ? 'text-white/60' : 'text-gray-500'
        }`}>
          Tamamlandı
        </span>
      </div>
    </div>
  );
});

// Ana Dashboard Komponenti
const Dashboard = ({ words, categorizedWords, addToCategory, removeFromCategory, darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    totalWords,
    learnedWords,
    difficultWords,
    reviewWords,
    data,
    progressData,
    learningStreak,
    completionRate,
    trends
  } = useMemo(() => {
    const totalWords = words.length;
    const learnedWords = categorizedWords['Öğrendiğim Kelimeler']?.length || 0;
    const difficultWords = categorizedWords['Zorlandığım Kelimeler']?.length || 0;
    const reviewWords = categorizedWords['Tekrar Edilecek Kelimeler']?.length || 0;
    const remainingWords = totalWords - learnedWords - difficultWords - reviewWords;

    const trends = {
      learned: 12.5,
      difficult: -8.3,
      review: 15.7,
      total: 5.2
    };

    const data = [
      { name: 'Öğrenilen', value: learnedWords, color: COLORS.success },
      { name: 'Zorlanılan', value: difficultWords, color: COLORS.danger },
      { name: 'Tekrar', value: reviewWords, color: COLORS.warning },
      { name: 'Kalan', value: remainingWords, color: COLORS.info },
    ];

    const progressData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        learned: Math.floor(Math.random() * 20) + 5,
        expected: 15
      };
    });

    const learningStreak = 7;
    const completionRate = ((learnedWords / totalWords) * 100).toFixed(1);

    return {
      totalWords,
      learnedWords,
      difficultWords,
      reviewWords,
      data,
      progressData,
      learningStreak,
      completionRate,
      trends
    };
  }, [words, categorizedWords]);

  const TabBar = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${
      darkMode ? 'bg-gray-900/70' : 'bg-white/70'
    } backdrop-blur-lg border-t ${
      darkMode ? 'border-gray-800' : 'border-gray-200'
    } p-2 pb-safe`}>
      <div className="flex gap-2">
        <TabButton
          active={activeTab === 'overview'}
          icon={BarChart2}
          label="Genel"
          onClick={() => setActiveTab('overview')}
          darkMode={darkMode}
        />
        <TabButton
          active={activeTab === 'progress'}
          icon={TrendingUp}
          label="İlerleme"
          onClick={() => setActiveTab('progress')}
          darkMode={darkMode}
        />
        <TabButton
          active={activeTab === 'achievements'}
          icon={Star}
          label="Başarılar"
          onClick={() => setActiveTab('achievements')}
          darkMode={darkMode}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Brain}
                title="Toplam"
                value={totalWords}
                color={COLORS.info}
                darkMode={darkMode}
                onClick={() => setSelectedCategory('Toplam Kelime')}
                trend={trends.total}
              />
              <StatCard
                icon={Award}
                title="Öğrenilen"
                value={learnedWords}
                color={COLORS.success}
                onClick={() => setSelectedCategory('Öğrendiğim Kelimeler')}
                darkMode={darkMode}
                trend={trends.learned}
              />
              <StatCard
                icon={Target}
                title="Zorlanılan"
                value={difficultWords}
                color={COLORS.danger}
                onClick={() => setSelectedCategory('Zorlandığım Kelimeler')}
                darkMode={darkMode}
                trend={trends.difficult}
              />
              <StatCard
                icon={RefreshCw}
                title="Tekrar"
                value={reviewWords}
                color={COLORS.warning}
                onClick={() => setSelectedCategory('Tekrar Edilecek Kelimeler')}
                darkMode={darkMode}
                trend={trends.review}
              />
            </div>

            {/* Dağılım Grafiği */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-2xl backdrop-blur-lg border
                ${darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-200/50'
                }`}
            >
              <h3 className={`text-base font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Kelime Dağılımı
              </h3>
              <MemoizedPieChart data={data} darkMode={darkMode} />
            </motion.div>
          </>
        );

      case 'progress':
        return (
          <>
            {/* İlerleme Grafiği */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl backdrop-blur-lg border
                ${darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-200/50'
                }`}
            >
              <h3 className={`text-base font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Haftalık İlerleme
              </h3>
              <MemoizedLineChart data={progressData} darkMode={darkMode} />
            </motion.div>

            {/* Genel İlerleme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`mt-4 p-4 rounded-2xl backdrop-blur-lg border
                ${darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-200/50'
                }`}
            >
              <h3 className={`text-base font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Genel İlerleme
              </h3>
              <div className="flex justify-center">
                <ProgressRing
                  progress={parseFloat(completionRate)}
                  color={COLORS.primary}
                  darkMode={darkMode}
                  size={160}
                />
              </div>
            </motion.div>
          </>
        );

      case 'achievements':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl backdrop-blur-lg border
              ${darkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-white/80 border-gray-200/50'
              }`}
          >
            {/* Öğrenme Serisi */}
            <div className={`p-4 rounded-xl ${
              darkMode
                ? 'bg-white/5'
                : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-violet-500/20' : 'bg-violet-50'
                  }`}>
                    <Calendar className={darkMode ? 'text-violet-300' : 'text-violet-500'} size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>
                      Öğrenme Serisi
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      Her gün düzenli çalışma
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  darkMode ? 'text-violet-400' : 'text-violet-600'
                }`}>
                  {learningStreak} Gün
                </span>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(learningStreak / 10) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      darkMode ? 'bg-violet-400' : 'bg-violet-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Diğer başarılar buraya eklenebilir */}
            {/* Günlük Hedef Başarısı */}
            <div className={`mt-4 p-4 rounded-xl ${
              darkMode
                ? 'bg-white/5'
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-emerald-500/20' : 'bg-emerald-50'
                  }`}>
                    <Target className={darkMode ? 'text-emerald-300' : 'text-emerald-500'} size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>
                      Günlük Hedef
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      15/20 kelime tamamlandı
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Toplam Çalışma Süresi */}
            <div className={`mt-4 p-4 rounded-xl ${
              darkMode
                ? 'bg-white/5'
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-amber-500/20' : 'bg-amber-50'
                  }`}>
                    <Clock className={darkMode ? 'text-amber-300' : 'text-amber-500'} size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>
                      Toplam Süre
                    </p>
                    <p className={`text-xs ${
                      darkMode ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      Bu hafta 4 saat 30 dakika
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      darkMode ? 'bg-amber-400' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        // default case handling
        break;
    }
  };

  return (
    <div className="relative min-h-screen w-full pb-[72px]">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[30rem] w-[30rem] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          </div>
        </div>
        <div className="absolute inset-0 backdrop-blur-xl" />
      </div>

      {/* Main Content */}
      <div className="relative">
        <PageHeader
          title="Kelime Paneli"
          subtitle="Günlük öğrenme hedeflerinizi takip edin"
          darkMode={darkMode}
        />

        <div className="p-4 space-y-4">
          {renderContent()}
        </div>

        {/* Bottom Tab Bar */}
        <TabBar />

        {/* Kategori Popup */}
        <AnimatePresence>
          {selectedCategory && (
            <CategoryWordsPopup
              category={selectedCategory}
              words={selectedCategory === 'Tüm Kelimeler' ? words : categorizedWords[selectedCategory] || []}
              onClose={() => setSelectedCategory(null)}
              addToCategory={addToCategory}
              removeFromCategory={removeFromCategory}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default React.memo(Dashboard);
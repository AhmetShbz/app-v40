import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Shield,
  Layers,
  Sun,
  Moon,
  Menu,
  Home,
  Settings as SettingsIcon,
  User,
  Gamepad
} from 'lucide-react';

// Existing Component Imports
import WordList from './WordList';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Settings from './Settings';
import AuthComponent from './AuthComponent';
import AdminAuth from './AdminAuth';
import AdminPanel from './AdminPanel';
import ProfileMenu from './ProfileMenu';

// Game Component Imports
import GamesHub from './games/GamesHub';
import WordMemoryGame from './games/WordMemoryGame';
import WordPuzzleGame from './games/WordPuzzleGame';
import WordDuel from './games/WordDuel';
import WordRacing from './games/WordRacing';

import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../utils/helpers';

// iOS style bottom tab navigation
const BottomTab = ({ icon: Icon, label, isActive, onClick, darkMode }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-2 ${
      isActive
        ? darkMode
          ? 'text-violet-400'
          : 'text-violet-600'
        : darkMode
          ? 'text-gray-500'
          : 'text-gray-400'
    }`}
  >
    <Icon size={24} className="mb-1" />
    <span className="text-xs font-medium">{label}</span>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className={`absolute top-0 h-0.5 w-10 ${
          darkMode ? 'bg-violet-400' : 'bg-violet-600'
        }`}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </motion.button>
);

// iOS style header
const Header = ({ darkMode, toggleDarkMode, userSettings, openMenu }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
      darkMode
        ? 'bg-gray-900/70 border-gray-800'
        : 'bg-white/70 border-gray-200'
    }`}
  >
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Layers className={darkMode ? 'text-violet-400' : 'text-violet-600'} size={24} />
        <h1 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {userSettings.isAdmin ? 'Admin Panel' : 'Lehçe Kelime'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className={`p-2 rounded-xl ${
            darkMode
              ? 'bg-gray-800 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openMenu}
          className={`p-2 rounded-xl ${
            darkMode
              ? 'bg-gray-800 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Menu size={20} />
        </motion.button>
      </div>
    </div>
  </motion.header>
);

// Admin panel specific header
const AdminHeader = ({ darkMode, handleLogout }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
      darkMode
        ? 'bg-gray-900/70 border-gray-800'
        : 'bg-white/70 border-gray-200'
    }`}
  >
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className={darkMode ? 'text-violet-400' : 'text-violet-600'} size={24} />
        <h1 className={`text-lg font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Admin Panel
        </h1>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className={`px-4 py-2 rounded-xl text-sm font-medium ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Çıkış Yap
      </motion.button>
    </div>
  </motion.header>
);

// Main Content component
const MainContent = ({
  darkMode,
  words,
  categorizedWords,
  categories,
  addToCategory,
  removeFromCategory,
  userSettings,
  setUserSettings,
  handleFileUpload,
  API_URL
}) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            words={words}
            categorizedWords={categorizedWords}
            categories={categories}
            addToCategory={addToCategory}
            removeFromCategory={removeFromCategory}
            darkMode={darkMode}
          />
        }
      />
      <Route
        path="/words"
        element={
          <WordList
            words={words}
            categories={categories}
            categorizedWords={categorizedWords}
            addToCategory={addToCategory}
            removeFromCategory={removeFromCategory}
            darkMode={darkMode}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <Profile
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            darkMode={darkMode}
            apiUrl={API_URL}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <Settings
            userSettings={userSettings}
            setUserSettings={setUserSettings}
            words={words}
            setWords={handleFileUpload}
            categories={categories}
            darkMode={darkMode}
          />
        }
      />

      {/* Game Routes */}
      <Route
        path="/games"
        element={
          <GamesHub
            darkMode={darkMode}
            words={words}
          />
        }
      />
      <Route
        path="/games/memory"
        element={
          <WordMemoryGame
            words={words}
            darkMode={darkMode}
            onBack={() => navigate('/games')}
          />
        }
      />
      <Route
        path="/games/puzzle"
        element={
          <WordPuzzleGame
            words={words}
            darkMode={darkMode}
            onBack={() => navigate('/games')}
          />
        }
      />
      <Route
        path="/games/duel"
        element={
          <WordDuel
            words={words}
            darkMode={darkMode}
            onBack={() => navigate('/games')}
          />
        }
      />
      <Route
        path="/games/racing"
        element={
          <WordRacing
            words={words}
            darkMode={darkMode}
            onBack={() => navigate('/games')}
          />
        }
      />

      {userSettings.isAdmin && (
        <Route
          path="/admin"
          element={
            <AdminPanel
              darkMode={darkMode}
              apiUrl={API_URL}
            />
          }
        />
      )}
    </Routes>
  );
};

// Bottom Navigation component
const BottomNavigation = ({ activeTab, setActiveTab, darkMode, isAdmin }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      darkMode ? 'bg-gray-900/70' : 'bg-white/70'
    } backdrop-blur-lg border-t ${
      darkMode ? 'border-gray-800' : 'border-gray-200'
    } pb-safe`}>
      <nav className="flex items-center justify-around h-16">
        {!isAdmin ? (
          <>
            <BottomTab
              icon={Home}
              label="Ana Sayfa"
              isActive={activeTab === 'dashboard'}
              onClick={() => handleTabChange('dashboard', '/')}
              darkMode={darkMode}
            />
            <BottomTab
              icon={BookOpen}
              label="Kelimeler"
              isActive={activeTab === 'words'}
              onClick={() => handleTabChange('words', '/words')}
              darkMode={darkMode}
            />
            <BottomTab
              icon={Gamepad}
              label="Oyunlar"
              isActive={activeTab === 'games'}
              onClick={() => handleTabChange('games', '/games')}
              darkMode={darkMode}
            />
            <BottomTab
              icon={User}
              label="Profil"
              isActive={activeTab === 'profile'}
              onClick={() => handleTabChange('profile', '/profile')}
              darkMode={darkMode}
            />
            <BottomTab
              icon={SettingsIcon}
              label="Ayarlar"
              isActive={activeTab === 'settings'}
              onClick={() => handleTabChange('settings', '/settings')}
              darkMode={darkMode}
            />
          </>
        ) : (
          <BottomTab
            icon={Shield}
            label="Admin Panel"
            isActive={true}
            onClick={() => {}}
            darkMode={darkMode}
          />
        )}
      </nav>
    </div>
  );
};

// Main App Component
const App = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // State definitions
  const [words, setWords] = useState(() =>
    getFromLocalStorage('words') || []
  );

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = useMemo(() => [
    'Öğrendiğim Kelimeler',
    'Zorlandığım Kelimeler',
    'Tekrar Edilecek Kelimeler',
  ], []);

  const [categorizedWords, setCategorizedWords] = useState(() => {
    const storedWords = getFromLocalStorage('categorizedWords') || {};
    return categories.reduce((acc, cat) => ({
      ...acc,
      [cat]: storedWords[cat] || []
    }), {});
  });

  const [userSettings, setUserSettings] = useState(() => ({
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    profileImage: localStorage.getItem('profileImage'),
    learnedWordsCount: parseInt(localStorage.getItem('learnedWordsCount') || '0'),
    dailyStreak: parseInt(localStorage.getItem('dailyStreak') || '0'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    lastLoginDate: localStorage.getItem('lastLoginDate'),
    preferences: JSON.parse(localStorage.getItem('preferences') || '{}'),
  }));

  const [darkMode, setDarkMode] = useState(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return localStorage.getItem('darkMode')
      ? JSON.parse(localStorage.getItem('darkMode'))
      : prefersDark;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Oyun rotalarını kontrol etmek için yeni fonksiyon
  const isGameRoute = useCallback((pathname) => {
    return pathname.startsWith('/games/') && pathname !== '/games';
  }, []);

  // Event Handlers
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setIsAuthenticated(false);
      setIsAdminAuthenticated(false);
      setUserSettings({
        userId: null,
        username: null,
        email: null,
        profileImage: null,
        learnedWordsCount: 0,
        dailyStreak: 0,
        isAdmin: false,
        lastLoginDate: null,
        preferences: {},
      });

      localStorage.clear();
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      setIsMenuOpen(false);
    }
  }, [API_URL]);

  // Effects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setIsAdminAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token invalid');
        }

        const data = await response.json();
        setIsAuthenticated(true);
        setIsAdminAuthenticated(data.isAdmin);
        setUserSettings(prev => ({
          ...prev,
          ...data.user,
          isAdmin: data.isAdmin
        }));

      } catch (error) {
        console.error('Auth check error:', error);
        handleLogout();} finally {
          setIsLoading(false);
        }
      };
  
      checkAuth();
    }, [API_URL, handleLogout]);
  
    useEffect(() => {
      saveToLocalStorage('words', words);
    }, [words]);
  
    useEffect(() => {
      saveToLocalStorage('categorizedWords', categorizedWords);
    }, [categorizedWords]);
  
    useEffect(() => {
      Object.entries(userSettings).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, value.toString());
          }
        }
      });
    }, [userSettings]);
  
    useEffect(() => {
      document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);
  
    useEffect(() => {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isMenuOpen]);
  
    const addToCategory = useCallback((word, category) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
  
      setCategorizedWords(prev => {
        const newCategories = { ...prev };
        categories.forEach(cat => {
          newCategories[cat] = newCategories[cat]?.filter(w => w.polish !== word.polish) || [];
        });
        newCategories[category] = [...(newCategories[category] || []), {
          ...word,
          addedAt: new Date().toISOString()
        }];
        return newCategories;
      });
    }, [categories]);
  
    const removeFromCategory = useCallback((word, category) => {
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
  
      setCategorizedWords(prev => ({
        ...prev,
        [category]: prev[category]?.filter(w => w.polish !== word.polish) || []
      }));
    }, []);
  
    const handleFileUpload = useCallback(async (newWords) => {
      try {
        setIsLoading(true);
        setWords(newWords);
        saveToLocalStorage('words', newWords);
  
        await fetch(`${API_URL}/words/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ words: newWords })
        });
      } catch (error) {
        console.error('File upload error:', error);
      } finally {
        setIsLoading(false);
      }
    }, [API_URL]);
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }
  
    return (
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
          <Routes>
            {/* Admin routes */}
            <Route
              path="/admingiris"
              element={
                isAdminAuthenticated ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <AdminAuth
                    darkMode={darkMode}
                    setIsAuthenticated={setIsAuthenticated}
                    setIsAdminAuthenticated={setIsAdminAuthenticated}
                    setUserSettings={setUserSettings}
                    apiUrl={API_URL}
                  />
                )
              }
            />
            <Route
              path="/admin/*"
              element={
                isAdminAuthenticated ? (
                  <>
                    <AdminHeader
                      darkMode={darkMode}
                      handleLogout={handleLogout}
                    />
                    <AdminPanel
                      darkMode={darkMode}
                      apiUrl={API_URL}
                      handleLogout={handleLogout}
                      userSettings={userSettings}
                    />
                  </>
                ) : (
                  <Navigate to="/admingiris" replace />
                )
              }
            />
  
            {/* Normal user routes */}
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  userSettings.isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <>
                      {!isGameRoute(window.location.pathname) && (
                        <Header
                          darkMode={darkMode}
                          toggleDarkMode={toggleDarkMode}
                          userSettings={userSettings}
                          openMenu={() => setIsMenuOpen(true)}
                        />
                      )}
                      <ProfileMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        toggleDarkMode={toggleDarkMode}
                        darkMode={darkMode}
                        setActiveTab={setActiveTab}
                        handleLogout={handleLogout}
                        userSettings={userSettings}
                      />
                      <div className={!isGameRoute(window.location.pathname) ? "pb-20" : ""}>
                        <MainContent
                          darkMode={darkMode}
                          words={words}
                          categorizedWords={categorizedWords}
                          categories={categories}
                          addToCategory={addToCategory}
                          removeFromCategory={removeFromCategory}
                          userSettings={userSettings}
                          setUserSettings={setUserSettings}
                          handleFileUpload={handleFileUpload}
                          API_URL={API_URL}
                        />
                      </div>
                      {!isGameRoute(window.location.pathname) && (
                        <BottomNavigation
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          darkMode={darkMode}
                          isAdmin={userSettings.isAdmin}
                        />
                      )}
                    </>
                  )
                ) : (
                  <AuthComponent
                    darkMode={darkMode}
                    setIsAuthenticated={setIsAuthenticated}
                    setUserSettings={setUserSettings}
                    apiUrl={API_URL}
                  />
                )
              }
            />
          </Routes>
  
          <style jsx global>{`
            @supports (-webkit-touch-callout: none) {
              .min-h-screen {
                min-height: -webkit-fill-available;
              }
              .pb-safe {
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
  
            * {
              -webkit-tap-highlight-color: transparent;
              touch-action: manipulation;
            }
  
            body {
              -webkit-overflow-scrolling: touch;
              overscroll-behavior-y: none;
            }
          `}</style>
        </div>
      </Router>
    );
  };
  
  export default App;
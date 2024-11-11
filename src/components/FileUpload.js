// App.js

import React, { useState, useEffect } from 'react';
import WordList from './WordList';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Settings from './Settings';
import {
  getFromLocalStorage,
  saveToLocalStorage,
  parseCSV,
} from '../utils/helpers';
import {
  BookOpen,
  BarChart2,
  User,
  Settings as SettingsIcon,
  Moon,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import defaultWordListContent from '../data/karışık.csv';

const App = () => {
  const [words, setWords] = useState(() => {
    const storedWords = getFromLocalStorage('words');
    if (storedWords && storedWords.length > 0) {
      return storedWords;
    } else {
      const parsedWords = parseCSV(defaultWordListContent);
      saveToLocalStorage('words', parsedWords);
      return parsedWords;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories] = useState([
    'Öğrendiğim Kelimeler',
    'Zorlandığım Kelimeler',
    'Tekrar Edilecek Kelimeler',
  ]);
  const [categorizedWords, setCategorizedWords] = useState(
    () => getFromLocalStorage('categorizedWords') || {}
  );
  const [userSettings, setUserSettings] = useState(
    () => getFromLocalStorage('userSettings') || {}
  );
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    saveToLocalStorage('words', words);
  }, [words]);

  useEffect(() => {
    saveToLocalStorage('categorizedWords', categorizedWords);
  }, [categorizedWords]);

  useEffect(() => {
    saveToLocalStorage('userSettings', userSettings);
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToCategory = (word, category) => {
    setCategorizedWords((prev) => {
      const updatedCategories = { ...prev };
      categories.forEach((cat) => {
        if (updatedCategories[cat]) {
          updatedCategories[cat] = updatedCategories[cat].filter(
            (w) => w.polish !== word.polish
          );
        }
      });
      updatedCategories[category] = [
        ...(updatedCategories[category] || []),
        word,
      ];
      return updatedCategories;
    });
  };

  const removeFromCategory = (word, category) => {
    setCategorizedWords((prev) => ({
      ...prev,
      [category]: prev[category].filter((w) => w.polish !== word.polish),
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleFileUpload = (newWords) => {
    setWords(newWords);
    saveToLocalStorage('words', newWords);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="container mx-auto p-4">
        <header
          className={`flex flex-col md:flex-row justify-between items-center mb-6 ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } p-4 rounded-lg shadow-md`}
        >
          <h1
            className={`text-3xl font-bold mb-4 md:mb-0 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Lehçe Kelime Uygulaması
          </h1>
          <nav className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
              }`}
            >
              <User size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-green-600 hover:bg-gray-300'
              }`}
            >
              <SettingsIcon size={24} />
            </motion.button>
          </nav>
        </header>

        <div className="mb-6 flex justify-center">
          {['dashboard', 'words'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 mr-2 rounded-md flex items-center transition-colors duration-300 ${
                activeTab === tab
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'dashboard' && (
                <BarChart2 className="mr-2" size={20} />
              )}
              {tab === 'words' && <BookOpen className="mr-2" size={20} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard
                words={words}
                categorizedWords={categorizedWords}
                categories={categories}
                addToCategory={addToCategory}
                removeFromCategory={removeFromCategory}
                darkMode={darkMode}
              />
            </motion.div>
          )}
          {activeTab === 'words' && (
            <motion.div
              key="words"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <WordList
                words={words}
                categories={categories}
                categorizedWords={categorizedWords}
                addToCategory={addToCategory}
                removeFromCategory={removeFromCategory}
                darkMode={darkMode}
              />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Profile
                userSettings={userSettings}
                setUserSettings={setUserSettings}
                darkMode={darkMode}
              />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Settings
                userSettings={userSettings}
                setUserSettings={setUserSettings}
                words={words}
                setWords={handleFileUpload}
                categories={categories}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

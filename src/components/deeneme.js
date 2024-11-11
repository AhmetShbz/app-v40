import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Mail, ArrowRight, CheckCircle, XCircle,
  Eye, EyeOff, LogIn, UserPlus, ChevronRight, Zap,
  Shield, Sparkles, ArrowLeft
} from 'lucide-react';
import axios from 'axios';

const AuthComponent = ({
  darkMode,
  setIsAuthenticated,
  setUserSettings,
  apiUrl
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(
          `${apiUrl}/login`,
          { loginIdentifier, password }
        );
        setNotification({
          type: 'success',
          message: 'Giriş başarılı! Yönlendiriliyorsunuz...',
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('profileImage', response.data.profileImage || '');
        setUserSettings({
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          profileImage: response.data.profileImage || '',
          learnedWordsCount: response.data.learnedWordsCount,
          dailyStreak: response.data.dailyStreak,
          isAdmin: false,
        });
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1500);
      } else {
        await axios.post(`${apiUrl}/register`, {
          username,
          email,
          password,
        });
        setNotification({
          type: 'success',
          message: 'Kayıt başarılı! Giriş yapılıyor...',
        });
        setTimeout(async () => {
          const loginResponse = await axios.post(
            `${apiUrl}/login`,
            { loginIdentifier: email, password }
          );
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('userId', loginResponse.data.userId);
          localStorage.setItem('username', loginResponse.data.username);
          localStorage.setItem('email', loginResponse.data.email);
          localStorage.setItem('profileImage', loginResponse.data.profileImage || '');
          setUserSettings({
            userId: loginResponse.data.userId,
            username: loginResponse.data.username,
            email: loginResponse.data.email,
            profileImage: loginResponse.data.profileImage || '',
            learnedWordsCount: loginResponse.data.learnedWordsCount,
            dailyStreak: loginResponse.data.dailyStreak,
            isAdmin: false,
          });
          setIsAuthenticated(true);
        }, 1500);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Bir hata oluştu',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setLoginIdentifier('');
    setEmail('');
    setPassword('');
    setUsername('');
    setNotification({ type: '', message: '' });
  };

  return (
    <div
      className="relative"
      style={{
        height: viewportHeight,
        minHeight: viewportHeight,
        maxHeight: viewportHeight,
        overflow: 'hidden'
      }}
    >
      {/* Modern Animated Background */}
      <div className={`absolute inset-0 ${
        darkMode
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-gray-900 to-black'
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200 via-indigo-100 to-white'
      }`}>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-t from-background/10 via-background/50 to-background/80 backdrop-blur-[1px]"
        />
      </div>

      <div className={`relative h-full overflow-auto ${isMobile ? 'pb-8' : ''} scrollbar-hide`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`min-h-full flex flex-col md:flex-row md:items-center md:justify-center p-4 md:p-8`}
        >
          <div className={`w-full max-w-md mx-auto md:max-w-4xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden
            ${darkMode
              ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/50'
              : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
            }`}
          >
            {/* Left Panel - Visible on tablet and desktop */}
            {!isMobile && (
              <div className="relative w-full md:w-1/2 p-8 hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      opacity: [0.3, 0.6]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-violet-600/20 bg-[length:200%_200%]"
                  />
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                </div>

                <div className="relative z-10 text-white space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl inline-block"
                    >
                      <Sparkles className="w-12 h-12" />
                    </motion.div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                      {isLogin ? 'Tekrar Hoşgeldiniz!' : 'Aramıza Katılın'}
                    </h2>
                    <p className="text-lg text-blue-100">
                      {isLogin
                        ? 'Kelimelerin büyülü dünyasına geri dönün'
                        : 'Yeni kelimelerle dolu bir maceraya başlayın'
                      }
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {['Kişiselleştirilmiş öğrenme', 'Akıllı tekrar sistemi', 'Detaylı analiz'].map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5, scale: 1.01 }}
                        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className={`w-full md:w-1/2 ${isMobile ? 'min-h-full' : ''} p-6 md:p-8`}>
              {/* Mobile Logo and Title */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={`inline-flex p-3 rounded-full mb-4 ${
                      darkMode
                        ? 'bg-gray-700/50 backdrop-blur-sm'
                        : 'bg-gray-100/80 backdrop-blur-sm'
                    }`}
                  >
                    <Sparkles className={`w-8 h-8 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </motion.div>
                  <h1 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isLogin ? 'Hoşgeldiniz!' : 'Hesap Oluşturun'}
                  </h1>
                </motion.div>
              )}

              {/* Notifications */}
              <AnimatePresence mode="wait">
                {notification.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 p-4 rounded-xl flex items-center backdrop-blur-sm ${
                      notification.type === 'error'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}
                  >
                    {notification.type === 'error' ?
                      <XCircle className="shrink-0" /> :
                      <CheckCircle className="shrink-0" />
                    }
                    <span className="ml-3 text-sm">{notification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <div className={`relative group ${
                        darkMode
                          ? 'focus-within:bg-gray-700/50'
                          : 'focus-within:bg-white/50'
                        } rounded-xl transition-all duration-300`}>
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                        }`} size={20} />
                        <input
                          type="text"
                          placeholder="Kullanıcı Adı"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-700/30 text-white placeholder-gray-400 focus:bg-gray-700/50'
                              : 'bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:bg-white/50'
                          } border border-transparent focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm`}
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email/Username Input */}
                <div className={`relative group ${
                  darkMode
                    ? 'focus-within:bg-gray-700/50'
                    : 'focus-within:bg-white/50'
                  } rounded-xl transition-all duration-300`}>
                  {isLogin ? (
                    <User className={`absolute left-4 top-1/2-translate-y-1/2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                    }`} size={20} />
                  ) : (
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                    }`} size={20} />
                  )}
                  <input
                    type={isLogin ? "text" : "email"}
                    placeholder={isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}
                    value={isLogin ? loginIdentifier : email}
                    onChange={(e) => isLogin
                      ? setLoginIdentifier(e.target.value)
                      : setEmail(e.target.value)
                    }
                    className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-200 ${
                      darkMode
                        ? 'bg-gray-700/30 text-white placeholder-gray-400 focus:bg-gray-700/50'
                        : 'bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:bg-white/50'
                    } border border-transparent focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm`}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className={`relative group ${
                  darkMode
                    ? 'focus-within:bg-gray-700/50'
                    : 'focus-within:bg-white/50'
                  } rounded-xl transition-all duration-300`}>
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'
                  }`} size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl transition-all duration-200 ${
                      darkMode
                        ? 'bg-gray-700/30 text-white placeholder-gray-400 focus:bg-gray-700/50'
                        : 'bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:bg-white/50'
                    } border border-transparent focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    } focus:outline-none`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-4 mt-6 flex items-center justify-center gap-2 rounded-xl
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}
                    relative overflow-hidden group
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600
                    text-white font-medium shadow-lg shadow-blue-500/20
                    transition-all duration-200`}
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                      <span>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-8 flex items-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 ${
                      darkMode
                        ? 'bg-gray-800/40 text-gray-400'
                        : 'bg-white/80 text-gray-500'
                    } backdrop-blur-sm`}>
                      veya
                    </span>
                  </div>
                </div>

                {/* Toggle Auth Mode Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleAuthMode}
                  className={`w-full py-4 flex items-center justify-center gap-2 rounded-xl
                    relative overflow-hidden group
                    ${darkMode
                      ? 'bg-gray-700/30 hover:bg-gray-700/50 text-white'
                      : 'bg-gray-50/50 hover:bg-white/50 text-gray-800'
                    } backdrop-blur-sm transition-all duration-200 border border-transparent hover:border-gray-500/10`}
                >
                  <div className={`absolute inset-0 ${
                    darkMode
                      ? 'bg-gray-600/20'
                      : 'bg-gray-100/50'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                  <ArrowRight size={20} className="rotate-180" />
                  <span>{isLogin ? "Yeni Hesap Oluştur" : "Giriş Yap"}</span>
                </motion.button>

                {/* Mobile Features */}
                {isMobile && (
                  <div className={`mt-8 pt-8 border-t ${
                    darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                  }`}>
                    <div className="space-y-4">
                      {['Kişiselleştirilmiş öğrenme', 'Akıllı tekrar sistemi', 'Detaylı analiz'].map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ x: 5, scale: 1.01 }}
                          className={`flex items-center space-x-3 p-3 rounded-xl
                            backdrop-blur-sm border border-transparent hover:border-gray-500/10
                            ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'}
                            transition-all duration-300`}
                        >
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-600/50' : 'bg-white/50'
                          }`}>
                            <CheckCircle className={`w-4 h-4 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .bg-grid-white {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default AuthComponent;




burası appjsdosyası


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  BarChart2,
  Shield,
  Layers,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import WordList from './WordList';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Settings from './Settings';
import AuthComponent from './AuthComponent';
import AdminAuth from './AdminAuth';
import AdminPanel from './AdminPanel';
import ProfileMenu from './ProfileMenu';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../utils/helpers';

// Renk ve stil sabitleri
const COLORS = {
  primary: '#8B5CF6',    // Mor
  success: '#10B981',    // Yeşil
  warning: '#F59E0B',    // Turuncu
  danger: '#EF4444',     // Kırmızı
  info: '#3B82F6',       // Mavi
  gray: '#6B7280'        // Gri
};

// Layout Bileşenleri
const NavigationButton = ({ icon: Icon, label, isActive, onClick, darkMode }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
      ${isActive
        ? darkMode
          ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
          : 'bg-violet-50 text-violet-600 ring-1 ring-violet-500/30'
        : darkMode
          ? 'bg-white/5 text-white/70 hover:bg-white/10'
          : 'bg-white/80 text-gray-600 hover:bg-white'
      } backdrop-blur-sm shadow-lg hover:shadow-xl border
      ${darkMode
        ? 'border-white/10'
        : 'border-gray-200/50'
      }`}
  >
    <Icon size={20} className={`${
      isActive
        ? 'text-violet-500'
        : darkMode
          ? 'text-white/70'
          : 'text-gray-500'
    }`} />
    <span className="font-medium">{label}</span>
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className={`absolute inset-0 rounded-xl ring-2 ${
          darkMode ? 'ring-violet-500/30' : 'ring-violet-500/20'
        }`}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </motion.button>
);

const Header = ({ darkMode, toggleDarkMode, userSettings, setActiveTab, handleLogout }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`sticky top-0 z-50 mb-6 backdrop-blur-xl border-b
      ${darkMode
        ? 'bg-white/5 border-white/10'
        : 'bg-white/80 border-gray-200/50'
      }`}
  >
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-xl ${
              darkMode ? 'bg-violet-500/20' : 'bg-violet-50'
            }`}
          >
            <Layers className={darkMode ? 'text-violet-400' : 'text-violet-600'} size={24} />
          </motion.div>
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Lehçe Kelime
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${
              darkMode
                ? 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                : 'bg-white/80 text-violet-600 hover:bg-white border border-gray-200/50'
            }`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          <ProfileMenu
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            userSettings={userSettings}
          />
        </div>
      </div>
    </div>
  </motion.header>
);const Navigation = ({ activeTab, setActiveTab, darkMode, userSettings }) => (
  <motion.nav
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-8"
  >
    {/* Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-500/30 via-transparent to-indigo-500/30 bg-[size:200%_200%]"
      />
    </div>

    {/* Navigation Content */}
    <div className="relative container mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-4">
        <NavigationButton
          icon={BarChart2}
          label="Dashboard"
          isActive={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
          darkMode={darkMode}
        />
        <NavigationButton
          icon={BookOpen}
          label="Kelimeler"
          isActive={activeTab === 'words'}
          onClick={() => setActiveTab('words')}
          darkMode={darkMode}
        />
        {userSettings.isAdmin && (
          <NavigationButton
            icon={Shield}
            label="Admin"
            isActive={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  </motion.nav>
);

const MainContent = ({
  activeTab,
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
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 pb-8"
    >
      {activeTab === 'dashboard' && (
        <Dashboard
          words={words}
          categorizedWords={categorizedWords}
          categories={categories}
          addToCategory={addToCategory}
          removeFromCategory={removeFromCategory}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'words' && (
        <WordList
          words={words}
          categories={categories}
          categorizedWords={categorizedWords}
          addToCategory={addToCategory}
          removeFromCategory={removeFromCategory}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'profile' && (
        <Profile
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          darkMode={darkMode}
          apiUrl={API_URL}
        />
      )}
      {activeTab === 'settings' && (
        <Settings
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          words={words}
          setWords={handleFileUpload}
          categories={categories}
          darkMode={darkMode}
        />
      )}
      {activeTab === 'admin' && userSettings.isAdmin && (
        <AdminPanel
          darkMode={darkMode}
          apiUrl={API_URL}
        />
      )}
    </motion.div>
  </AnimatePresence>
);

// Loading Spinner komponenti
const LoadingSpinner = ({ darkMode }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
      </div>
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-500/30 via-transparent to-indigo-500/30 bg-[size:200%_200%]"
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />
    </div>

    {/* Spinner */}
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`w-16 h-16 rounded-full border-4 border-t-transparent
          ${darkMode
            ? 'border-violet-400'
            : 'border-violet-500'
          }`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-4 text-center ${
          darkMode ? 'text-white/70' : 'text-gray-600'
        }`}
      >
        Yükleniyor...
      </motion.div>
    </div>
  </div>
);// Ana App bileşeni
const App = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // State ve Hooks tanımlamaları
  const [words, setWords] = useState(() =>
    getFromLocalStorage('words') || []
  );

  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Callback fonksiyonları
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

      // State'leri temizle
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
    }
  }, [API_URL]);

  // Auth Effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Token invalid');

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
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [API_URL, handleLogout]);

  // Storage Effects
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

  // Kategori fonksiyonları
  const addToCategory = useCallback((word, category) => {
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
    setCategorizedWords(prev => ({
      ...prev,
      [category]: prev[category]?.filter(w => w.polish !== word.polish) || []
    }));
  }, []);

  // Dosya yükleme
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

  // Loading durumu
  if (isLoading) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[40rem] w-[40rem] animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          </div>
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-500/30 via-transparent to-indigo-500/30 bg-[size:200%_200%]"
          />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>

        {/* Main Content */}
        <div className="relative">
          {isAuthenticated ? (
            <>
              <Header
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                userSettings={userSettings}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
              />

              <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
                userSettings={userSettings}
              />

              <MainContent
                activeTab={activeTab}
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
            </>
          ) : (
            <Routes>
              <Route
                path="/admingiris"
                element={
                  isAdminAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <AdminAuth
                      darkMode={darkMode}
                      setIsAuthenticated={setIsAdminAuthenticated}
                      setUserSettings={setUserSettings}
                      apiUrl={API_URL}
                    />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <AuthComponent
                    darkMode={darkMode}
                    setIsAuthenticated={setIsAuthenticated}
                    setUserSettings={setUserSettings}
                    apiUrl={API_URL}
                  />
                }
              />
            </Routes>
          )}
        </div>

        <style jsx global>{`
          @supports (-webkit-touch-callout: none) {
            .min-h-screen {
              min-height: -webkit-fill-available;
            }
          }
          .bg-grid-white {
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }
        `}</style>
      </motion.div>
    </Router>
  );
};

export default App;


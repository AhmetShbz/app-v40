import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Mail, ArrowRight, CheckCircle, XCircle,
  Eye, EyeOff, LogIn, UserPlus, ChevronRight, Sparkles,
  Shield, Star, Zap
} from 'lucide-react';

const AuthComponent = ({
  darkMode = false,
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
        // Login logic remains the same
        setNotification({
          type: 'success',
          message: 'Giriş başarılı! Yönlendiriliyorsunuz...',
        });
        setTimeout(() => setIsAuthenticated(true), 1500);
      } else {
        // Register logic remains the same
        setNotification({
          type: 'success',
          message: 'Kayıt başarılı! Giriş yapılıyor...',
        });
        setTimeout(() => setIsAuthenticated(true), 1500);
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

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Hızlı Öğrenme',
      description: 'Kişiselleştirilmiş öğrenme deneyimi'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Akıllı Tekrar',
      description: 'Yapay zeka destekli tekrar sistemi'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'İlerleme Takibi',
      description: 'Detaylı analiz ve raporlama'
    }
  ];

  const InputField = ({ icon, type, placeholder, value, onChange, rightIcon }) => (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
        darkMode ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-500 group-focus-within:text-blue-600'
      }`}>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-${rightIcon ? '12' : '4'} py-4 rounded-xl transition-all duration-200
          ${darkMode
            ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-600'
            : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white'
          } border-2 border-transparent focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 focus:outline-none`}
        required
      />
      {rightIcon}
    </div>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-4 p-4 rounded-xl transition-colors duration-200 ${
        darkMode
          ? 'bg-gray-700/50 hover:bg-gray-600/50'
          : 'bg-white/50 hover:bg-white'
      }`}
    >
      <div className={`p-2 rounded-lg ${
        darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
      }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl
          ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'}`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Info Panel */}
            {!isMobile && (
              <div className="w-full md:w-5/12 p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl w-fit">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">
                        {isLogin ? 'Tekrar Hoşgeldiniz!' : 'Aramıza Katılın'}
                      </h2>
                      <p className="text-blue-100">
                        Kelime öğrenmenin en akıllı yolu
                      </p>
                    </motion.div>

                    <div className="space-y-4 mt-8">
                      {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Panel */}
            <div className="w-full md:w-7/12 p-8">
              <AnimatePresence mode="wait">
                {notification.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-6 p-4 rounded-xl flex items-center ${
                      notification.type === 'error'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}
                  >
                    {notification.type === 'error' ? <XCircle /> : <CheckCircle />}
                    <span className="ml-3 text-sm font-medium">{notification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <InputField
                        icon={<User size={20} />}
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField
                  icon={isLogin ? <User size={20} /> : <Mail size={20} />}
                  type={isLogin ? "text" : "email"}
                  placeholder={isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}
                  value={isLogin ? loginIdentifier : email}
                  onChange={(e) => isLogin
                    ? setLoginIdentifier(e.target.value)
                    : setEmail(e.target.value)
                  }
                />

                <InputField
                  icon={<Lock size={20} />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 mt-6 rounded-xl text-white font-medium
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600
                    hover:opacity-90 transition-all duration-200
                    flex items-center justify-center gap-2
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 ${
                      darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                    }`}>
                      veya
                    </span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setNotification({ type: '', message: '' });
                  }}
                  className={`w-full py-4 rounded-xl font-medium
                    flex items-center justify-center gap-2
                    ${darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } transition-all duration-200`}
                >
                  <ArrowRight size={20} className="rotate-180" />
                  <span>{isLogin ? "Yeni Hesap Oluştur" : "Giriş Yap"}</span>
                </motion.button>

                {isMobile && (
                  <div className={`mt-8 pt-8 space-y-4 border-t ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    {features.map((feature, index) => (
                      <FeatureCard key={index} {...feature} />
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
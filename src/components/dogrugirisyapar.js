import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Mail, ArrowRight,
  Eye, EyeOff, LogIn, UserPlus, ChevronRight, Sparkles,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const NotificationMessages = {
  login: {
    success: '✨ Giriş başarılı! Hoş geldiniz...',
    error: {
      default: '❌ Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
      userNotFound: '❌ Kullanıcı bulunamadı',
      wrongPassword: '❌ Şifre hatalı',
      networkError: '❌ Bağlantı hatası. Lütfen tekrar deneyin.'
    },
    loading: '🔄 Giriş yapılıyor...',
  },
  register: {
    success: '🎉 Kayıt başarılı! Aramıza hoş geldiniz!',
    error: {
      default: '❌ Kayıt başarısız. Lütfen tekrar deneyin.',
      userExists: '❌ Bu kullanıcı adı veya e-posta zaten kullanımda!',
    },
    loading: '🔄 Hesabınız oluşturuluyor...',
  },
  validation: {
    required: '⚠️ Bu alan zorunludur',
    username: {
      required: '⚠️ Kullanıcı adı zorunludur',
      tooShort: '⚠️ Kullanıcı adı en az 3 karakter olmalıdır',
      invalid: '⚠️ Kullanıcı adı geçersiz karakterler içeriyor'
    },
    email: {
      required: '⚠️ E-posta adresi zorunludur',
      invalid: '⚠️ Geçerli bir e-posta adresi giriniz'
    },
    password: {
      required: '⚠️ Şifre zorunludur',
      tooShort: '⚠️ Şifre en az 6 karakter olmalıdır'
    }
  }
};

const formFeatures = [
  {
    icon: '🎯',
    title: 'Kişiselleştirilmiş öğrenme',
    description: 'Size özel öğrenme deneyimi'
  },
  {
    icon: '🧠',
    title: 'Akıllı tekrar sistemi',
    description: 'Öğrenmenizi pekiştiren akıllı algoritma'
  },
  {
    icon: '📊',
    title: 'Detaylı analiz',
    description: 'İlerlemenizi takip edin'
  }
];

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
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ValidationError = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-2 mt-2 rounded-lg bg-red-500/10 border border-red-500/20"
    >
      <AlertCircle className="w-4 h-4 text-red-400" />
      <span className="text-sm text-red-400">{message}</span>
    </motion.div>
  );

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) {
          error = NotificationMessages.validation.username.required;
        } else if (value.length < 3) {
          error = NotificationMessages.validation.username.tooShort;
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = NotificationMessages.validation.username.invalid;
        }
        break;
      case 'email':
        if (!value) {
          error = NotificationMessages.validation.email.required;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = NotificationMessages.validation.email.invalid;
        }
        break;
      case 'password':
        if (!value) {
          error = NotificationMessages.validation.password.required;
        } else if (value.length < 5) {
          error = NotificationMessages.validation.password.tooShort;
        }
        break;
      case 'loginIdentifier':
        if (!value) {
          error = NotificationMessages.validation.required;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const value = fieldName === 'loginIdentifier' ? loginIdentifier :
                 fieldName === 'email' ? email :
                 fieldName === 'password' ? password :
                 fieldName === 'username' ? username : '';

    const error = validateField(fieldName, value);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const errors = {};

    if (isLogin) {
      const loginIdentifierError = validateField('loginIdentifier', loginIdentifier);
      if (loginIdentifierError) errors.loginIdentifier = loginIdentifierError;

      const passwordError = validateField('password', password);
      if (passwordError) errors.password = passwordError;
    } else {
      const usernameError = validateField('username', username);
      if (usernameError) errors.username = usernameError;

      const emailError = validateField('email', email);
      if (emailError) errors.email = emailError;

      const passwordError = validateField('password', password);
      if (passwordError) errors.password = passwordError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getInputClassName = (error, touched) => `
    w-full pl-12 pr-12 py-4 rounded-xl
    transition-all duration-200
    ${error && touched
      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20 bg-red-500/5'
      : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 bg-white/10'
    }
    text-white placeholder-white/50 backdrop-blur-sm
    focus:ring-2 outline-none
    invalid:border-red-500/50 invalid:focus:border-red-500/50 invalid:focus:ring-red-500/20
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const touchedFields = isLogin
      ? { loginIdentifier: true, password: true }
      : { username: true, email: true, password: true };
    setTouched(touchedFields);

    if (!validateForm()) {
      return;
    }

    setNotification({
      type: 'loading',
      message: isLogin
        ? NotificationMessages.login.loading
        : NotificationMessages.register.loading
    });
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(
          `${apiUrl}/login`,
          { loginIdentifier, password }
        );

        if (!response?.data?.token) {
          throw new Error(response?.data?.message || NotificationMessages.login.error.default);
        }

        setNotification({
          type: 'success',
          message: NotificationMessages.login.success,
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
          learnedWordsCount: response.data.learnedWordsCount || 0,
          dailyStreak: response.data.dailyStreak || 0,
          isAdmin: response.data.isAdmin || false,
        });

        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1500);
      } else {
        const response = await axios.post(`${apiUrl}/register`, {
          username,
          email,
          password,
        });

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || NotificationMessages.register.error.default);
        }

        setNotification({
          type: 'success',
          message: NotificationMessages.register.success,
        });

        setTimeout(async () => {
          try {
            const loginResponse = await axios.post(
              `${apiUrl}/login`,
              { loginIdentifier: email, password }
            );

            if (!loginResponse?.data?.token) {
              throw new Error();
            }

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
              learnedWordsCount: loginResponse.data.learnedWordsCount || 0,
              dailyStreak: loginResponse.data.dailyStreak || 0,
              isAdmin: loginResponse.data.isAdmin || false,
            });

            setIsAuthenticated(true);
          } catch {
            setNotification({
              type: 'error',
              message: '❌ Otomatik giriş başarısız oldu. Lütfen manuel giriş yapın.',
            });
          }
        }, 1500);
      }
    } catch (error) {
      let errorMessage;

      if (error.response) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = NotificationMessages.login.error.networkError;
      } else {
        errorMessage = error.message;
      }

      setNotification({
        type: 'error',
        message: errorMessage || (isLogin
          ? NotificationMessages.login.error.default
          : NotificationMessages.register.error.default),
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
    setFormErrors({});
    setTouched({});
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900">
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

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row">
              {/* Left Panel - Features */}
              {!isMobile && (
                <div className="relative w-full md:w-1/2 p-8 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-lg">
                  <div className="relative z-10 h-full flex flex-col justify-center text-white space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-lg mb-4">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">
                        {isLogin ? '👋 Tekrar Hoşgeldiniz!' : '🎉 Aramıza Katılın'}
                      </h2>
                      <p className="text-white/80">
                        {isLogin
                          ? '📚 Kelimelerin büyülü dünyasına geri dönün'
                          : '🚀 Yeni kelimelerle dolu bir maceraya başlayın'
                        }
                      </p>
                    </motion.div>

                    <div className="space-y-4 mt-8">
                      {formFeatures.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="text-2xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-white font-medium">{feature.title}</h3>
                            <p className="text-white/70 text-sm">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Right Panel - Form */}
              <div className="w-full md:w-1/2 p-8">
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-lg mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                      {isLogin ? '👋 Hoşgeldiniz!' : '🎉 Hesap Oluşturun'}
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
                      className={`mb-6 p-4 rounded-xl flex items-center backdrop-blur-sm ${
                        notification.type === 'error'
                          ? 'bg-red-500/10 text-red-200 border border-red-500/20'
                          : notification.type === 'loading'
                          ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                      }`}
                    >
                      <span className="text-sm font-medium">{notification.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="relative group">
                          <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                            ${touched.username && formErrors.username
                              ? 'text-red-400'
                              : 'text-white/50 group-hover:text-white/70'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              if (touched.username) {
                                setFormErrors({
                                  ...formErrors,
                                  username: validateField('username', e.target.value)
                                });
                              }
                            }}
                            onBlur={() => handleBlur('username')}
                            className={getInputClassName(formErrors.username, touched.username)}
                          />
                          <AnimatePresence>
                            {touched.username && formErrors.username && (
                              <ValidationError message={formErrors.username} />
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative group">
                    {isLogin ? (
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                        ${touched.loginIdentifier && formErrors.loginIdentifier
                          ? 'text-red-400'
                          : 'text-white/50 group-hover:text-white/70'
                        }`}
                      />
                    ) : (
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                        ${touched.email && formErrors.email
                          ? 'text-red-400'
                          : 'text-white/50 group-hover:text-white/70'
                        }`}
                      />
                    )}
                    <input
                      type={isLogin ? "text" : "email"}
                      placeholder={isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}
                      value={isLogin ? loginIdentifier : email}
                      onChange={(e) => {
                        if (isLogin) {
                          setLoginIdentifier(e.target.value);
                          if (touched.loginIdentifier) {
                            setFormErrors({
                              ...formErrors,
                              loginIdentifier: validateField('loginIdentifier', e.target.value)
                            });
                          }
                        } else {
                          setEmail(e.target.value);
                          if (touched.email) {
                            setFormErrors({
                              ...formErrors,
                              email: validateField('email', e.target.value)
                            });
                          }
                        }
                      }}
                      onBlur={() => handleBlur(isLogin ? 'loginIdentifier' : 'email')}
                      className={getInputClassName(
                        isLogin ? formErrors.loginIdentifier : formErrors.email,
                        isLogin ? touched.loginIdentifier : touched.email
                      )}
                    />
                    <AnimatePresence>
                      {((isLogin && touched.loginIdentifier && formErrors.loginIdentifier) ||
                        (!isLogin && touched.email && formErrors.email)) && (
                        <ValidationError
                          message={isLogin ? formErrors.loginIdentifier : formErrors.email}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                      ${touched.password && formErrors.password
                        ? 'text-red-400'
                        : 'text-white/50 group-hover:text-white/70'
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifre"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touched.password) {
                          setFormErrors({
                            ...formErrors,
                            password: validateField('password', e.target.value)
                          });
                        }
                      }}
                      onBlur={() => handleBlur('password')}
                      className={getInputClassName(formErrors.password, touched.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <AnimatePresence>
                      {touched.password && formErrors.password && (
                        <ValidationError message={formErrors.password} />
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 mt-6 flex items-center justify-center gap-2 rounded-xl
                      ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'}
                      relative overflow-hidden group
                      bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500
                      text-white font-medium shadow-lg shadow-purple-500/25
                      transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
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
                        <span>{isLogin ? '🚀 Giriş Yap' : '✨ Kayıt Ol'}</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </motion.button>

                  <div className="relative my-8 flex items-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-white/60">
                        veya
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={toggleAuthMode}
                    className="w-full py-4 flex items-center justify-center gap-2 rounded-xl
                      bg-white/10 hover:bg-white/15 backdrop-blur-sm
                      text-white font-medium
                      transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>{isLogin ? "🌟 Yeni Hesap Oluştur" : "👋 Giriş Yap"}</span>
                  </motion.button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-sm">
                    <ShieldCheck size={16} />
                    <span>Güvenli bağlantı ile koruma altında</span>
                  </div>

                  {isMobile && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="space-y-4">
                        {formFeatures.map((feature, index) => (
                          <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center space-x-3 p-4 rounded-xl
                              bg-white/10 backdrop-blur-sm
                              border border-white/10 hover:border-white/20
                              transition-all duration-300"
                          >
                            <div className="text-2xl">{feature.icon}</div>
                            <div>
                              <h3 className="text-white font-medium">{feature.title}</h3>
                              <p className="text-white/70 text-sm">{feature.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>
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
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default AuthComponent;
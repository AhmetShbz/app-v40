import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  ChevronRight,
  LogIn
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationMessages = {
  login: {
    success: '✨ Giriş başarılı! Admin paneline yönlendiriliyorsunuz...',
    error: {
      default: '❌ Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
      userNotFound: '❌ Yönetici bulunamadı',
      wrongPassword: '❌ Şifre hatalı',
      networkError: '❌ Bağlantı hatası. Lütfen tekrar deneyin.'
    },
    loading: '🔄 Giriş yapılıyor...',
  },
  validation: {
    required: '⚠️ Bu alan zorunludur',
    username: {
      required: '⚠️ Kullanıcı adı zorunludur',
      tooShort: '⚠️ Kullanıcı adı en az 5 karakter olmalıdır',
      invalid: '⚠️ Kullanıcı adı geçersiz karakterler içeriyor'
    },
    email: {
      required: '⚠️ E-posta adresi zorunludur',
      invalid: '⚠️ Geçerli bir e-posta adresi giriniz'
    },
    password: {
      required: '⚠️ Şifre zorunludur',
      tooShort: '⚠️ Şifre en az 3 karakter olmalıdır'
    }
  }
};

const adminFeatures = [
  {
    icon: '🛡️',
    title: 'Tam Kontrol Yetkisi',
    description: 'Sistemi yönetme gücü'
  },
  {
    icon: '🔐',
    title: 'Gelişmiş Güvenlik',
    description: 'İki faktörlü kimlik doğrulama'
  },
  {
    icon: '⚡',
    title: 'Yönetici Araçları',
    description: 'Özel yönetim paneli'
  }
];

const AdminAuth = ({
  darkMode,
  setIsAuthenticated,
  setUserSettings,
  apiUrl
}) => {
  const navigate = useNavigate();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

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
      case 'loginIdentifier':
        if (!value) {
          error = NotificationMessages.validation.required;
        }
        break;
      case 'password':
        if (!value) {
          error = NotificationMessages.validation.password.required;
        } else if (value.length < 5) {
          error = NotificationMessages.validation.password.tooShort;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const value = fieldName === 'loginIdentifier' ? loginIdentifier : password;
    const error = validateField(fieldName, value);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const errors = {};
    const loginIdentifierError = validateField('loginIdentifier', loginIdentifier);
    const passwordError = validateField('password', password);

    if (loginIdentifierError) errors.loginIdentifier = loginIdentifierError;
    if (passwordError) errors.password = passwordError;

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
  `;

  const handleAdminAuth = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('username', authData.username);
    localStorage.setItem('email', authData.email);
    localStorage.setItem('profileImage', authData.profileImage || '');
    localStorage.setItem('isAdmin', 'true');

    setUserSettings({
      userId: authData.userId,
      username: authData.username,
      email: authData.email,
      profileImage: authData.profileImage || '',
      isAdmin: true
    });

    setIsAuthenticated(true);

    // Admin girişi başarılı olduğunda direk admin paneline yönlendir
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const touchedFields = { loginIdentifier: true, password: true };
    setTouched(touchedFields);

    if (!validateForm()) {
      return;
    }

    setNotification({
      type: 'loading',
      message: NotificationMessages.login.loading
    });
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/admin/login`,
        { loginIdentifier, password }
      );

      setNotification({
        type: 'success',
        message: NotificationMessages.login.success,
      });

      handleAdminAuth(response.data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || NotificationMessages.login.error.default,
      });
      setIsLoading(false);
    }
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
                        <Shield className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">
                        👋 Admin Panel
                      </h2>
                      <p className="text-white/80">
                        ⚡ Sistemi yönetmek için giriş yapın
                      </p>
                    </motion.div>

                    <div className="space-y-4 mt-8">
                      {adminFeatures.map((feature, index) => (
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
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                      ${touched.loginIdentifier && formErrors.loginIdentifier
                        ? 'text-red-400'
                        : 'text-white/50 group-hover:text-white/70'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="E-posta veya Kullanıcı Adı"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (touched.loginIdentifier) {
                          setFormErrors({
                            ...formErrors,
                            loginIdentifier: validateField('loginIdentifier', e.target.value)
                          });
                        }
                      }}
                      onBlur={() => handleBlur('loginIdentifier')}
                      className={getInputClassName(formErrors.loginIdentifier, touched.loginIdentifier)}
                    />
                    <AnimatePresence>
                      {touched.loginIdentifier && formErrors.loginIdentifier && (
                        <ValidationError message={formErrors.loginIdentifier} />
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
                        <LogIn size={20} />
                        <span>🚀 Giriş Yap</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </motion.button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-sm">
                    <Shield size={16} />
                    <span>Güvenli admin bağlantısı</span>
                  </div>
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

export default AdminAuth;
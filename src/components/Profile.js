import React, { useState, useEffect } from 'react';
import {
  User,
  Upload,
  Edit2,
  Save,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Award,
  Calendar,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Notification mesajları
const NotificationMessages = {
  profile: {
    success: {
      update: '✨ Profil başarıyla güncellendi!',
      imageUpload: '🖼️ Profil resmi başarıyla güncellendi!'
    },
    error: {
      update: '❌ Profil güncellenirken bir hata oluştu.',
      imageUpload: '❌ Resim yüklenirken bir hata oluştu.',
      imageSize: '❌ Resim boyutu çok büyük (max 5MB).',
      imageFormat: '❌ Desteklenmeyen dosya formatı.'
    },
    validation: {
      email: {
        required: '⚠️ E-posta adresi zorunludur',
        invalid: '⚠️ Geçerli bir e-posta adresi giriniz'
      },
      password: {
        required: '⚠️ Şifre zorunludur',
        tooShort: '⚠️ Şifre en az 6 karakter olmalıdır',
        noMatch: '⚠️ Şifreler eşleşmiyor',
        current: '⚠️ Mevcut şifre zorunludur'
      }
    }
  }
};

// Sabit veriler
const ACHIEVEMENTS = [
  {
    title: "Öğrenme Serisi",
    value: "7 Gün",
    icon: Calendar,
    color: "#8B5CF6",
    progress: 70
  },
  {
    title: "Toplam Kelime",
    value: "250+",
    icon: BookOpen,
    color: "#3B82F6",
    progress: 85
  },
  {
    title: "Günlük Hedef",
    value: "15/20",
    icon: Target,
    color: "#10B981",
    progress: 75
  },
  {
    title: "Çalışma Süresi",
    value: "45 dk",
    icon: Clock,
    color: "#F59E0B",
    progress: 60
  }
];

const STATS = [
  {
    label: "Bu Hafta",
    learned: 45,
    trend: "+12%",
    isPositive: true
  },
  {
    label: "Bu Ay",
    learned: 180,
    trend: "+8%",
    isPositive: true
  },
  {
    label: "Toplam",
    learned: 750,
    trend: "Hedef: 1000",
    isPositive: true
  }
];

const BADGES = [
  {
    title: "Hızlı Öğrenen",
    description: "Bir günde 20+ kelime",
    icon: Zap,
    color: "#8B5CF6"
  },
  {
    title: "Kararlı Öğrenci",
    description: "7 günlük seri",
    icon: Award,
    color: "#F59E0B"
  },
  {
    title: "Kelime Ustası",
    description: "500+ kelime",
    icon: Star,
    color: "#EF4444"
  }
];

// iOS tarzı Header komponenti
const PageHeader = ({ title, onBack, darkMode }) => (
  <div className={`sticky top-0 z-50 ${
    darkMode ? 'bg-gray-900/70' : 'bg-white/70'
  } backdrop-blur-lg border-b ${
    darkMode ? 'border-gray-800' : 'border-gray-200'
  } px-4 py-3 flex items-center gap-3`}>
    {onBack && (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className={`p-2 rounded-xl ${
          darkMode
            ? 'hover:bg-gray-800 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <ChevronLeft size={20} />
      </motion.button>
    )}
    <h1 className={`text-lg font-bold ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}>
      {title}
    </h1>
  </div>
);

// Validation Error komponenti
const ValidationError = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg bg-red-500/10 border border-red-500/20"
  >
    <AlertCircle className="w-4 h-4 text-red-400" />
    <span className="text-xs text-red-400">{message}</span>
  </motion.div>
);

const Profile = ({ userSettings, setUserSettings, darkMode, apiUrl }) => {
  // State tanımlamaları
  const [profileImage, setProfileImage] = useState(userSettings.profileImage || null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(userSettings.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfileImage(userSettings.profileImage);
    setNewEmail(userSettings.email);
  }, [userSettings]);

  // Validation fonksiyonları
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) {
          error = NotificationMessages.profile.validation.email.required;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = NotificationMessages.profile.validation.email.invalid;
        }
        break;
      case 'currentPassword':
        if (!value && (newPassword || confirmPassword)) {
          error = NotificationMessages.profile.validation.password.current;
        }
        break;
      case 'newPassword':
        if (value && value.length < 6) {
          error = NotificationMessages.profile.validation.password.tooShort;
        }
        break;
      case 'confirmPassword':
        if (value && value !== newPassword) {
          error = NotificationMessages.profile.validation.password.noMatch;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const value = fieldName === 'email' ? newEmail :
                 fieldName === 'currentPassword' ? currentPassword :
                 fieldName === 'newPassword' ? newPassword :
                 fieldName === 'confirmPassword' ? confirmPassword : '';

    const error = validateField(fieldName, value);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const errors = {};

    const emailError = validateField('email', newEmail);
    if (emailError) errors.email = emailError;

    if (newPassword || confirmPassword) {
      const currentPasswordError = validateField('currentPassword', currentPassword);
      if (currentPasswordError) errors.currentPassword = currentPasswordError;

      const newPasswordError = validateField('newPassword', newPassword);
      if (newPasswordError) errors.newPassword = newPasswordError;

      const confirmPasswordError = validateField('confirmPassword', confirmPassword);
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Input className helper
  const getInputClassName = (error, touched) => `
    w-full pl-10 pr-12 py-2.5 rounded-xl transition-all duration-200 text-sm
    ${error && touched
      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20 bg-red-500/5'
      : darkMode
        ? 'bg-gray-700/50 border-gray-600 focus:border-violet-500/50 focus:ring-violet-500/20'
        : 'bg-gray-50/50 border-gray-200 focus:border-violet-500/50 focus:ring-violet-500/20'
    }
    ${darkMode ? 'text-white' : 'text-gray-900'}
    border focus:ring-2 outline-none
  `;

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: 'error',
        message: NotificationMessages.profile.error.imageSize
      });
      return;
    }

    // Dosya formatı kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setNotification({
        type: 'error',
        message: NotificationMessages.profile.error.imageFormat
      });
      return;
    }

    try {
      setIsLoading(true);
      // Dosyayı base64'e çevir
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await axios.post(`${apiUrl}/profile/upload-image`, {
            userId: userSettings.userId,
            image: reader.result
          });

          if (response.data.success) {
            setProfileImage(reader.result);
            setUserSettings({
              ...userSettings,
              profileImage: reader.result
            });
            setNotification({
              type: 'success',
              message: NotificationMessages.profile.success.imageUpload
            });
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          setNotification({
            type: 'error',
            message: NotificationMessages.profile.error.imageUpload
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setNotification({
        type: 'error',
        message: NotificationMessages.profile.error.imageUpload
      });
      setIsLoading(false);
    }
  };

  // Form submit handler
  const handleSave = async () => {
    const touchedFields = {
      email: true,
      currentPassword: Boolean(newPassword || confirmPassword),
      newPassword: Boolean(newPassword),
      confirmPassword: Boolean(confirmPassword)
    };
    setTouched(touchedFields);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const updateData = {
        userId: userSettings.userId,
        email: newEmail,
        ...(newPassword && {
          currentPassword,
          newPassword
        })
      };

      const response = await axios.post(
        `${apiUrl}/profile/update`,
        updateData
      );

      if (response.data.success) {
        setUserSettings({
          ...userSettings,
          email: newEmail
        });
        setNotification({
          type: 'success',
          message: NotificationMessages.profile.success.update
        });
        setIsEditing(false);
        // Şifre alanlarını temizle
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFormErrors({});
        setTouched({});
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || NotificationMessages.profile.error.update
      });
    } finally {
      setIsLoading(false);
    }
  };

  // iOS tarzı profil header'ı
  const ProfileHeader = () => (
    <div className={`relative p-4 rounded-2xl overflow-hidden backdrop-blur-xl
      ${darkMode ? 'bg-white/10' : 'bg-white/80'}
      border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
    >
      <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profil"
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-violet-500 transition-all duration-300"
            />
          ) : (
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-violet-500
              ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <User size={32} className={darkMode ? 'text-white/50' : 'text-gray-400'} />
            </div>
          )}
          {isEditing && (
            <label
              htmlFor="profile-image"
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-violet-500 active:bg-violet-600 text-white cursor-pointer transition-all duration-300 shadow-lg"
            >
              <Upload size={16} />
              <input
                type="file"
                id="profile-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
            </label>)}
        </div>
        <div className="text-center">
          <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {userSettings.username}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
            {userSettings.email}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {['Premium Üye', '750+ Kelime', '7 Gün Seri'].map((badge, index) => (
              <span
                key={index}
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  darkMode
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'bg-violet-50 text-violet-600'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // iOS tarzı tab butonları
  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200 ${
        isActive
          ? darkMode
            ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30'
            : 'bg-violet-50 text-violet-600 ring-1 ring-violet-500/30'
          : darkMode
            ? 'text-white/60'
            : 'text-gray-600'
      }`}
    >
      <Icon size={16} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  // iOS tarzı başarı kartı
  const AchievementCard = ({ achievement }) => {
    const Icon = achievement.icon;
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`p-4 rounded-xl backdrop-blur-sm ${
          darkMode ? 'bg-white/5' : 'bg-white/80'
        } border ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${achievement.color}20` }}>
            <Icon size={18} style={{ color: achievement.color }} />
          </div>
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            darkMode ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            {achievement.value}
          </div>
        </div>
        <h4 className={`text-sm font-medium mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {achievement.title}
        </h4>
        <div className="h-1.5 bg-gray-200/20 dark:bg-gray-700/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${achievement.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: achievement.color }}
          />
        </div>
      </motion.div>
    );
  };

  // iOS tarzı istatistik kartı
  const StatCard = ({ stat }) => (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl backdrop-blur-sm ${
        darkMode ? 'bg-white/5' : 'bg-white/80'
      } border ${
        darkMode ? 'border-white/10' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
          {stat.label}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          stat.isPositive
            ? darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600'
            : darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
        }`}>
          {stat.trend}
        </span>
      </div>
      <div className={`text-xl font-bold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {stat.learned}
      </div>
    </motion.div>
  );

  // iOS tarzı rozet kartı
  const BadgeCard = ({ badge }) => {
    const Icon = badge.icon;
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`p-4 rounded-xl backdrop-blur-sm ${
          darkMode ? 'bg-white/5' : 'bg-white/80'
        } border ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        } group active:bg-white/5 transition-all duration-300`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${badge.color}20` }}>
            <Icon size={18} style={{ color: badge.color }} />
          </div>
          <div>
            <h4 className={`text-sm font-medium mb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {badge.title}
            </h4>
            <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              {badge.description}
            </p>
          </div>
          <ArrowRight
            size={16}
            className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
              darkMode ? 'text-white/60' : 'text-gray-600'
            }`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen pb-safe">
      {/* iOS tarzı Header */}
      <PageHeader
        title="Profilim"
        darkMode={darkMode}
      />

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
      <div className="relative p-4 space-y-4">
        {/* Düzenle/Kaydet Butonları */}
        <div className="flex justify-end">
          {!isEditing ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl flex items-center gap-2 bg-violet-500 text-white active:bg-violet-600 transition-all duration-200 text-sm"
            >
              <Edit2 size={16} />
              Düzenle
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl flex items-center gap-2 bg-violet-500 text-white active:bg-violet-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save size={16} />
                )}
                Kaydet
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  setFormErrors({});
                  setTouched({});
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setNewEmail(userSettings.email);
                }}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  darkMode
                    ? 'bg-white/10 text-white active:bg-white/20'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                } transition-all duration-200 text-sm`}
              >
                <X size={16} />
                İptal
              </motion.button>
            </div>
          )}
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-xl flex items-center gap-2 backdrop-blur-sm ${
                notification.type === 'error'
                  ? 'bg-red-500/10 text-red-200 border border-red-500/20'
                  : notification.type === 'loading'
                  ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
              }`}
            >
              {notification.type === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              <span className="text-xs font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 rounded-xl bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm">
          <TabButton
            icon={User}
            label="Profil"
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
          <TabButton
            icon={Lock}
            label="Güvenlik"
            isActive={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          />
          <TabButton
            icon={TrendingUp}
            label="İstatistik"
            isActive={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Başarılar */}
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                darkMode ? 'bg-white/5' : 'bg-white/80'
              } border ${
                darkMode ? 'border-white/10' : 'border-gray-200'
              }`}>
                <h3 className={`text-base font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Başarılarım
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((achievement, index) => (
                    <AchievementCard key={index} achievement={achievement} />
                  ))}
                </div>
              </div>

              {/* Rozetler */}
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                darkMode ? 'bg-white/5' : 'bg-white/80'
              } border ${
                darkMode ? 'border-white/10' : 'border-gray-200'
              }`}>
                <h3 className={`text-base font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Rozetler
                </h3>
                <div className="space-y-3">
                  {BADGES.map((badge, index) => (
                    <BadgeCard key={index} badge={badge} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                darkMode ? 'bg-white/5' : 'bg-white/80'
              } border ${
                darkMode ? 'border-white/10' : 'border-gray-200'
              }`}>
                <h3 className={`text-base font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Hesap Güvenliği
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      darkMode ? 'text-white/60' : 'text-gray-700'
                    }`}>
                      E-posta
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          touched.email && formErrors.email
                            ? 'text-red-400'
                            : darkMode ? 'text-white/50' : 'text-gray-500'
                        }`}
                        size={18}
                      />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                          if (touched.email) {
                            setFormErrors({
                              ...formErrors,
                              email: validateField('email', e.target.value)
                            });
                          }
                        }}
                        onBlur={() => handleBlur('email')}
                        disabled={!isEditing}
                        className={getInputClassName(formErrors.email, touched.email)}
                      />
                      <AnimatePresence>
                        {touched.email && formErrors.email && (
                          <ValidationError message={formErrors.email} />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Şifre Alanları */}
                  {isEditing && (
                    <>
                      {/* Mevcut Şifre */}
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          darkMode ? 'text-white/60' : 'text-gray-700'
                        }`}>
                          Mevcut Şifre
                        </label>
                        <div className="relative">
                          <Lock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              touched.currentPassword && formErrors.currentPassword
                                ? 'text-red-400'
                                : darkMode ? 'text-white/50' : 'text-gray-500'
                            }`}
                            size={18}
                          />
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              if (touched.currentPassword) {
                                setFormErrors({
                                  ...formErrors,
                                  currentPassword: validateField('currentPassword', e.target.value)
                                });
                              }
                            }}
                            onBlur={() => handleBlur('currentPassword')}
                            className={getInputClassName(formErrors.currentPassword, touched.currentPassword)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              darkMode ? 'text-white/50 active:text-white/70' : 'text-gray-500 active:text-gray-700'
                            }`}
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <AnimatePresence>
                            {touched.currentPassword && formErrors.currentPassword && (
                              <ValidationError message={formErrors.currentPassword} />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Yeni Şifre */}
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          darkMode ? 'text-white/60' : 'text-gray-700'
                        }`}>
                          Yeni Şifre
                        </label>
                        <div className="relative">
                          <Lock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              touched.newPassword && formErrors.newPassword
                                ? 'text-red-400'
                                : darkMode ? 'text-white/50' : 'text-gray-500'
                            }`}
                            size={18}
                          />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (touched.newPassword) {
                                setFormErrors({
                                  ...formErrors,
                                  newPassword: validateField('newPassword', e.target.value)
                                });
                              }
                            }}
                            onBlur={() => handleBlur('newPassword')}
                            className={getInputClassName(formErrors.newPassword, touched.newPassword)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              darkMode ? 'text-white/50 active:text-white/70' : 'text-gray-500 active:text-gray-700'
                            }`}
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <AnimatePresence>
                            {touched.newPassword && formErrors.newPassword && (
                              <ValidationError message={formErrors.newPassword} />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Şifre Tekrar */}
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          darkMode ? 'text-white/60' : 'text-gray-700'
                        }`}>
                          Yeni Şifre (Tekrar)
                        </label>
                        <div className="relative">
                          <Lock
                            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              touched.confirmPassword && formErrors.confirmPassword
                                ? 'text-red-400'
                                : darkMode ? 'text-white/50' : 'text-gray-500'
                            }`}
                            size={18}
                          />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (touched.confirmPassword) {
                                setFormErrors({
                                  ...formErrors,
                                  confirmPassword: validateField('confirmPassword', e.target.value)
                                });
                              }
                            }}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={getInputClassName(formErrors.confirmPassword, touched.confirmPassword)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                              darkMode ? 'text-white/50 active:text-white/70' : 'text-gray-500 active:text-gray-700'
                            }`}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <AnimatePresence>
                            {touched.confirmPassword && formErrors.confirmPassword && (
                              <ValidationError message={formErrors.confirmPassword} />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                darkMode ? 'bg-white/5' : 'bg-white/80'
              } border ${
                darkMode ? 'border-white/10' : 'border-gray-200'
              }`}>
                <h3 className={`text-base font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Öğrenme İstatistikleri
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {STATS.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
};

export default Profile;
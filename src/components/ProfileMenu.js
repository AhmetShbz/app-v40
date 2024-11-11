import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  LogOut,
  Shield,
  User,
  Bell,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Clock,
  Trash2,
  Settings as SettingsIcon,
  Home
} from 'lucide-react';

const ProfileMenu = React.memo(({
  isOpen,
  onClose,
  toggleDarkMode,
  darkMode,
  setActiveTab,
  handleLogout,
  userSettings
}) => {
  const [currentView, setCurrentView] = useState('main');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Ödeme başarılı',
      message: 'Pro üyelik ödemesi başarıyla gerçekleşti',
      time: '5 dakika önce',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Yeni özellik',
      message: 'Yeni AI destekli özellikler eklendi',
      time: '1 saat önce',
      read: false
    },
    {
      id: 3,
      type: 'pending',
      title: 'Sistem bakımı',
      message: 'Planlı bakım 24 saat içinde gerçekleşecek',
      time: '3 saat önce',
      read: true
    }
  ]);

  const deleteNotification = useCallback((id) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const NotificationIcon = ({ type }) => {
    switch (type) {
      case 'success':
        return <Check className="text-emerald-500" size={18} />;
      case 'info':
        return <Bell className="text-blue-500" size={18} />;
      case 'pending':
        return <Clock className="text-amber-500" size={18} />;
      default:
        return <Bell className="text-gray-500" size={18} />;
    }
  };

  const NotificationItem = ({ notification }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isDeleting ? 0 : 1,
          y: isDeleting ? -20 : 0
        }}
        exit={{ opacity: 0, height: 0 }}
        onClick={() => !notification.read && markAsRead(notification.id)}
        className={`relative p-4 rounded-xl mb-2 active:scale-98 transition-transform
          ${darkMode
            ? notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
            : notification.read ? 'bg-gray-50' : 'bg-white'
          }
          ${!notification.read && 'ring-1 ring-violet-500/20'}
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <NotificationIcon type={notification.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {notification.title}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                  setTimeout(() => deleteNotification(notification.id), 200);
                }}
                className={`p-1.5 rounded-lg
                  ${darkMode
                    ? 'text-red-400 active:bg-red-500/20'
                    : 'text-red-500 active:bg-red-50'
                  }
                `}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {notification.time}
              </span>
              {!notification.read && (
                <div className={`px-2 py-0.5 text-xs rounded-full
                  ${darkMode
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'bg-violet-50 text-violet-600'
                  }`}
                >
                  Okunmadı
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const MenuButton = ({ icon: Icon, text, subText, onClick, darkMode, danger, badge }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center justify-between w-full px-4 py-3 rounded-xl active:bg-opacity-75
        ${danger
          ? darkMode
            ? 'text-red-400 active:bg-red-500/10'
            : 'text-red-600 active:bg-red-50'
          : darkMode
            ? 'text-gray-200 active:bg-gray-800'
            : 'text-gray-700 active:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center min-w-0">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-xl mr-3
          ${danger
            ? darkMode
              ? 'text-red-400 bg-red-500/10'
              : 'text-red-600 bg-red-50'
            : darkMode
              ? 'text-white bg-gray-800'
              : 'text-gray-700 bg-gray-100'
          }
        `}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium">{text}</div>
          {subText && (
            <div className={`text-xs truncate
              ${danger
                ? darkMode ? 'text-red-400/60' : 'text-red-600/60'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {subText}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {badge && (
          <div className={`
            px-2 py-0.5 rounded-full text-xs font-medium mr-2
            ${darkMode
              ? 'bg-violet-500/20 text-violet-300'
              : 'bg-violet-50 text-violet-600'
            }
          `}>
            {badge}
          </div>
        )}
        <ChevronRight
          size={16}
          className={`
            ${danger
              ? darkMode ? 'text-red-400/30' : 'text-red-600/30'
              : darkMode ? 'text-gray-600' : 'text-gray-400'
            }
          `}
        />
      </div>
      {userSettings.isAdmin && (
  <MenuButton
    icon={Shield}
    text="Admin Panel"
    subText="Sistem ve kullanıcı yönetimi"
    onClick={() => {
      handleTabChange('admin');
      onClose(); // Menüyü kapat
    }}
    darkMode={darkMode}
  />
)}
    </motion.button>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'notifications':
        return (
          <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            className="h-full"
          >
            <div className={`px-4 py-3 flex items-center justify-between border-b ${
              darkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('main')}
                  className={`p-2 rounded-xl ${
                    darkMode
                      ? 'active:bg-gray-800 text-gray-400'
                      : 'active:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Bildirimler
                </h2>
              </div>

              {notifications.length > 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotifications([])}
                  className={`px-3 py-1.5 text-sm rounded-xl
                    ${darkMode
                      ? 'text-red-400 active:bg-red-500/20'
                      : 'text-red-500 active:bg-red-50'
                    }
                  `}
                >
                  Tümünü Sil
                </motion.button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <AnimatePresence>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center py-8 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <Bell className="mx-auto mb-3 opacity-50" size={24} />
                    <p>Henüz bildirim bulunmuyor</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
          >
            {/* Profil Bilgileri */}
            <div className={`px-4 py-3 border-b
              ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-3">
                  {userSettings.profileImage ? (
                    <div className="relative">
                      <img
                        src={userSettings.profileImage}
                        alt="Profil"
                        className={`w-12 h-12 rounded-xl object-cover ring-2
                          ${darkMode
                            ? 'ring-violet-500'
                            : 'ring-violet-500'
                          }`}
                      />
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2
                        ${darkMode
                          ? 'border-gray-900 bg-emerald-500'
                          : 'border-white bg-emerald-500'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                    >
                      <User size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userSettings.username || 'Kullanıcı'}
                    </div>
                    <div className={`text-sm truncate ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {userSettings.email || 'kullanici@örnek.com'}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={`p-2 rounded-xl ${
                    darkMode
                      ? 'active:bg-gray-800 text-gray-400'
                      : 'active:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <MenuButton
                icon={Home}
                text="Ana Sayfa"
                subText="Dashboard'a dön"
                onClick={() => handleTabChange('dashboard')}
                darkMode={darkMode}
              />
              <MenuButton
                icon={User}
                text="Profil"
                subText="Profil bilgilerinizi görüntüleyin"
                onClick={() => handleTabChange('profile')}
                darkMode={darkMode}
              />
              <MenuButton
                icon={Bell}
                text="Bildirimler"
                subText="Tüm bildirimlerinizi görüntüleyin"
                onClick={() => setCurrentView('notifications')}
                darkMode={darkMode}
                badge={notifications.filter(n => !n.read).length || null}
              />
              <MenuButton
                icon={SettingsIcon}
                text="Hesap Ayarları"
                subText="Profil ve gizlilik ayarlarınızı yönetin"
                onClick={() => handleTabChange('settings')}
                darkMode={darkMode}
              />
              <MenuButton
                icon={Shield}
                text="Güvenlik"
                subText="Güvenlik tercihlerinizi yapılandırın"
                onClick={() => handleTabChange('security')}
                darkMode={darkMode}
              />
              <MenuButton
                icon={HelpCircle}
                text="Yardım Merkezi"
                subText="SSS ve destek dokümantasyonu"
                onClick={() => handleTabChange('help')}
                darkMode={darkMode}
              />
              <MenuButton
                icon={darkMode ? Sun : Moon}
                text={darkMode ? 'Açık Mod' : 'Koyu Mod'}
                subText="Görünüm tercihlerinizi ayarlayın"
                onClick={() => {
                  toggleDarkMode();
                  // Haptic feedback
                  if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                  }
                }}
                darkMode={darkMode}
              />
              <MenuButton
                icon={LogOut}
                text="Çıkış Yap"
                subText="Hesabınızdan güvenli çıkış yapın"
                onClick={() => {
                  // Haptic feedback
                  if ('vibrate' in navigator) {
                    navigator.vibrate([100, 30, 100]);
                  }
                  handleLogout();
                }}
                darkMode={darkMode}
                danger
              />
            </div>

            {/* Premium Banner */}
            <div className="px-4 pt-4 pb-6">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl ${
                  darkMode
                    ? 'bg-violet-500/10 border border-violet-500/20'
                    : 'bg-violet-50 border border-violet-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    darkMode
                      ? 'bg-violet-500/20'
                      : 'bg-violet-100'
                  }`}>
                    <Shield className={
                      darkMode ? 'text-violet-400' : 'text-violet-600'
                    } size={20} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-violet-300' : 'text-violet-700'
                    }`}>
                      Premium'a Yükseltin
                    </h3>
                    <p className={`text-xs ${
                      darkMode ? 'text-violet-400' : 'text-violet-600'
                    }`}>
                      Tüm özelliklere sınırsız erişim için premium hesaba yükseltin
                    </p>
                    <button className={`mt-3 px-3 py-1.5 text-xs font-medium rounded-lg
                      ${darkMode
                        ? 'bg-violet-500/20 text-violet-300 active:bg-violet-500/30'
                        : 'bg-violet-100 text-violet-600 active:bg-violet-200'
                      }`}
                    >
                      Daha Fazla Bilgi
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 z-40 backdrop-blur-sm ${
              darkMode ? 'bg-black/50' : 'bg-gray-900/20'
            }`}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md z-50 ${
              darkMode
                ? 'bg-gray-900 border-l border-gray-800'
                : 'bg-white border-l border-gray-200'
            }`}
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default ProfileMenu;
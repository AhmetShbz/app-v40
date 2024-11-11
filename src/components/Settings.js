import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  AlertTriangle,
  Save,
  CheckCircle,
  Target,
  Bell,
  Settings as SettingsIcon,
  Shield,
  Globe,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu
} from 'lucide-react';
import { parseCSV } from '../utils/helpers';

// iOS tarzı PageHeader komponenti
const PageHeader = ({ title, subtitle, darkMode }) => (
  <div className={`sticky top-0 z-50 ${
    darkMode ? 'bg-gray-900/70' : 'bg-white/70'
  } backdrop-blur-lg border-b ${
    darkMode ? 'border-gray-800' : 'border-gray-200'
  } px-4 py-3`}>
    <div className="flex items-center justify-between">
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
      <button
        className={`p-2 rounded-xl ${
          darkMode
            ? 'bg-gray-800 text-gray-400'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Menu size={20} />
      </button>
    </div>
  </div>
);

const Settings = ({
  userSettings,
  setUserSettings,
  setWords,
  darkMode,
  toggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [notification, setNotification] = useState({
    type: '',
    message: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name) => {
    setUserSettings((prev) => ({ ...prev, [name]: !prev[name] }));

    // Haptic feedback for iOS
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const parsedWords = parseCSV(content);
          setWords(parsedWords);
          setNotification({
            type: 'success',
            message: 'Kelime listesi başarıyla yüklendi!',
          });
        } catch (err) {
          setNotification({
            type: 'error',
            message: 'CSV dosyası işlenirken bir hata oluştu. Lütfen dosya formatını kontrol edin.',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    setTimeout(() => {
      setNotification({
        type: 'success',
        message: 'Ayarlar başarıyla kaydedildi!',
      });
      setIsSaving(false);
    }, 1500);
  };

  // iOS tarzı tab butonu
  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? darkMode
            ? 'bg-violet-500/20 text-violet-400'
            : 'bg-violet-50 text-violet-600'
          : darkMode
            ? 'text-gray-400 active:bg-gray-800'
            : 'text-gray-600 active:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
      <ChevronRight
        size={18}
        className={`ml-auto ${
          darkMode ? 'text-gray-600' : 'text-gray-400'
        }`}
      />
    </motion.button>
  );

  // iOS tarzı toggle switch
  const ToggleSwitch = ({ label, name, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(name)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked
            ? darkMode ? 'bg-violet-500' : 'bg-violet-600'
            : darkMode ? 'bg-gray-700' : 'bg-gray-300'
          }`}
      >
        <motion.span
          layout
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
            ${checked ? 'translate-x-6' : 'translate-x-1'}`
          }
        />
      </motion.button>
    </div>
  );

  // iOS tarzı select input
  const SelectInput = ({ icon: Icon, label, name, value, options, onChange }) => (
    <div className="space-y-1.5">
      <label className={`text-sm ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm appearance-none ${
            darkMode
              ? 'bg-gray-800 text-white border-gray-700'
              : 'bg-white text-gray-900 border-gray-200'
          } border focus:ring-2 focus:ring-violet-500`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronRight
          size={18}
          className={`absolute right-3 top-1/2 -translate-y-1/2 rotate-90 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-base font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Genel Ayarlar
              </h3>

              <div className="space-y-3">
                <ToggleSwitch
                  label="Karanlık Mod"
                  name="darkMode"
                  checked={darkMode}
                  onChange={() => toggleDarkMode()}
                />
                <ToggleSwitch
                  label="Otomatik Oynatma"
                  name="autoPlay"
                  checked={userSettings.autoPlay}
                  onChange={handleToggleChange}
                />
                <ToggleSwitch
                  label="Ses Efektleri"
                  name="soundEffects"
                  checked={userSettings.soundEffects}
                  onChange={handleToggleChange}
                />

                <SelectInput
                  icon={Globe}
                  label="Arayüz Dili"
                  name="language"
                  value={userSettings.language || 'tr'}
                  onChange={handleChange}
                  options={[
                    { value: 'tr', label: 'Türkçe' },
                    { value: 'en', label: 'English' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'fr', label: 'Français' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-base font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Öğrenme Tercihleri
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <label className={`block text-sm mb-1.5 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Günlük Hedef (Kelime)
                  </label>
                  <div className="relative">
                    <Target
                      size={18}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      type="number"
                      name="dailyGoal"
                      value={userSettings.dailyGoal || ''}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm ${
                        darkMode
                          ? 'bg-gray-800 text-white border-gray-700'
                          : 'bg-white text-gray-900 border-gray-200'
                      } border focus:ring-2 focus:ring-violet-500`}
                    />
                  </div>
                </div>

                <SelectInput
                  icon={BookOpen}
                  label="Zorluk Seviyesi"
                  name="difficulty"
                  value={userSettings.difficulty || 'medium'}
                  onChange={handleChange}
                  options={[
                    { value: 'easy', label: 'Kolay' },
                    { value: 'medium', label: 'Orta' },
                    { value: 'hard', label: 'Zor' }
                  ]}
                />

                <SelectInput
                  icon={Clock}
                  label="Çalışma Modu"
                  name="studyMode"
                  value={userSettings.studyMode || 'standard'}
                  onChange={handleChange}
                  options={[
                    { value: 'standard', label: 'Standart' },
                    { value: 'spaced', label: 'Aralıklı Tekrar' },
                    { value: 'intensive', label: 'Yoğun Çalışma' }
                  ]}
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-base font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Kelime Listesi
              </h3>

              <label
                htmlFor="csv-upload"
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  darkMode
                    ? 'border-gray-700 active:border-violet-500/50 bg-gray-800/50'
                    : 'border-gray-300 active:border-violet-500/50 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload
                    className={`w-6 h-6 mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <p className={`text-sm text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    CSV dosyası yükle
                  </p>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    (Maks. 2MB)
                  </p>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <h3 className={`text-base font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Bildirim Ayarları
              </h3>

              <div className="space-y-3">
                <ToggleSwitch
                  label="Günlük Hatırlatıcılar"
                  name="dailyReminders"
                  checked={userSettings.dailyReminders}
                  onChange={handleToggleChange}
                />
                <ToggleSwitch
                  label="Başarı Bildirimleri"
                  name="achievementNotifications"
                  checked={userSettings.achievementNotifications}
                  onChange={handleToggleChange}
                />
                <ToggleSwitch
                  label="E-posta Bildirimleri"
                  name="emailNotifications"
                  checked={userSettings.emailNotifications}
                  onChange={handleToggleChange}
                />

<SelectInput
                  icon={Bell}
                  label="Bildirim Sıklığı"
                  name="notificationFrequency"
                  value={userSettings.notificationFrequency || 'daily'}
                  onChange={handleChange}
                  options={[
                    { value: 'hourly', label: 'Saatlik' },
                    { value: 'daily', label: 'Günlük' },
                    { value: 'weekly', label: 'Haftalık' },
                    { value: 'never', label: 'Asla' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen pb-safe">
      {/* iOS tarzı Header */}
      <PageHeader
        title="Ayarlar"
        subtitle="Uygulama tercihlerinizi yönetin"
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Tab Seçimi - Mobil için tek sütun */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <nav className="space-y-2">
            <TabButton
              icon={SettingsIcon}
              label="Genel Ayarlar"
              isActive={activeTab === 'general'}
              onClick={() => setActiveTab('general')}
            />
            <TabButton
              icon={BookOpen}
              label="Öğrenme Tercihleri"
              isActive={activeTab === 'learning'}
              onClick={() => setActiveTab('learning')}
            />
            <TabButton
              icon={Bell}
              label="Bildirimler"
              isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
          </nav>
        </div>

        {/* Premium Banner */}
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode
                ? 'bg-violet-500/20'
                : 'bg-violet-50'
            }`}>
              <Shield
                size={20}
                className={darkMode ? 'text-violet-400' : 'text-violet-600'}
              />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium mb-0.5 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Premium'a Yükseltin
              </h3>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Tüm özelliklere sınırsız erişim için
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                darkMode
                  ? 'bg-violet-500/20 text-violet-400 active:bg-violet-500/30'
                  : 'bg-violet-50 text-violet-600 active:bg-violet-100'
              }`}
            >
              Yükselt
            </motion.button>
          </div>
        </div>

        {/* Tab İçeriği */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Bildirim */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded-xl flex items-center gap-2 ${
                notification.type === 'error'
                  ? darkMode
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-red-50 text-red-600'
                  : darkMode
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {notification.type === 'error' ? (
                <AlertTriangle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              <span className="text-sm">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kaydet Butonu - Altta Sabit */}
        <motion.div
          className={`fixed bottom-0 left-0 right-0 p-4 pb-safe ${
            darkMode ? 'bg-gray-900/70' : 'bg-white/70'
          } backdrop-blur-lg border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`
              w-full py-3 rounded-xl font-medium text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${darkMode
                ? 'bg-violet-500 active:bg-violet-600 text-white'
                : 'bg-violet-500 active:bg-violet-600 text-white'
              }
              ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Save size={16} />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </motion.button>
        </motion.div>
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
      `}</style>
    </div>
  );
};

export default Settings;
// src/components/modals/UserEditModal.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';

const UserEditModal = ({ user, onClose, onSave, darkMode }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basit doğrulama
    if (!editedUser.username.trim() || !editedUser.email.trim()) {
      setError('Kullanıcı adı ve e-posta zorunludur');
      return;
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(editedUser);
      onClose();
    } catch (error) {
      setError('Kullanıcı güncellenirken bir hata oluştu');
      console.error('Güncelleme hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Input değiştiğinde hata mesajını temizle
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-lg p-6 rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kullanıcı Düzenle: {user.username}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
            }`}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${
            darkMode
              ? 'bg-red-500/10 text-red-400'
              : 'bg-red-50 text-red-600'
          }`}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Kullanıcı Adı
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={editedUser.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="accountStatus"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Hesap Durumu
            </label>
            <select
              id="accountStatus"
              name="accountStatus"
              value={editedUser.accountStatus}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
              disabled={isSubmitting}
            >
              <option value="active">Aktif</option>
              <option value="suspended">Askıya Alınmış</option>
              <option value="inactive">İnaktif</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="learnedWordsCount"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Öğrenilen Kelimeler
              </label>
              <input
                id="learnedWordsCount"
                name="learnedWordsCount"
                type="number"
                value={editedUser.learnedWordsCount}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-50 text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="dailyStreak"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Günlük Seri
              </label>
              <input
                id="dailyStreak"
                name="dailyStreak"
                type="number"
                value={editedUser.dailyStreak}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-50 text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting
                  ? 'bg-violet-400 cursor-not-allowed'
                  : 'bg-violet-500 hover:bg-violet-600'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserEditModal;
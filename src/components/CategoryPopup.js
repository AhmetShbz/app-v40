// src/components/CategoryPopup.js
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const CategoryPopup = ({
  word,
  categories,
  addToCategory,
  closePopup,
  darkMode,
}) => {
  // Animasyon varyantları
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Arka Plan Katmanı */}
      <div
        className={`absolute inset-0 ${
          darkMode ? 'bg-black bg-opacity-70' : 'bg-gray-800 bg-opacity-50'
        }`}
        onClick={closePopup}
      ></div>

      {/* Modal İçeriği */}
      <motion.div
        className={`relative p-6 rounded-lg shadow-xl w-11/12 max-w-md mx-4 ${
          darkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        variants={modalVariants}
        transition={{ duration: 0.3 }}
      >
        {/* Kapatma Butonu */}
        <button
          onClick={closePopup}
          className={`absolute top-4 right-4 focus:outline-none ${
            darkMode
              ? 'text-gray-300 hover:text-gray-100'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <X size={24} />
        </button>

        {/* Başlık */}
        <h3
          className={`text-lg sm:text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Kategori Seçin
        </h3>

        {/* Açıklama */}
        <p className={`mb-6 text-sm sm:text-base ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          "{word?.polish}" kelimesini hangi kategoriye eklemek istiyorsunuz?
        </p>

        {/* Kategori Butonları */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                addToCategory(word, category);
                closePopup();
              }}
              className={`w-full px-4 py-3 rounded-md text-sm sm:text-base transition-colors duration-300 ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* İptal Butonu */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={closePopup}
          className={`mt-6 w-full px-4 py-3 rounded-md text-sm sm:text-base transition-colors duration-300 ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          İptal
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CategoryPopup;

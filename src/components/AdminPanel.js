import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Edit, Trash2, ChevronLeft, ChevronRight,
  AlertCircle, Check, Download, X,
  BookOpen, Eye, Calendar, Phone,
  Clock, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import UserEditModal from './modals/UserEditModal';
import AddNoteModal from './modals/AddNoteModal';

// UserDetailModal Bileşeni
const UserDetailModal = ({ user, onClose, darkMode, onAddNote }) => {
  const [activeTab, setActiveTab] = useState('profile');

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
        className={`w-full max-w-4xl p-6 rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Kullanıcı Detayları: {user.username}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>{/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'profile'
                ? 'bg-violet-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'devices'
                ? 'bg-violet-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Cihaz Geçmişi
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'words'
                ? 'bg-violet-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Kelime Listesi
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notes'
                ? 'bg-violet-500 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            Admin Notları
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    E-posta
                  </label>
                  <div className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Kayıt Tarihi
                  </label>
                  <div className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {format(new Date(user.createdAt), 'PP', { locale: tr })}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Son Giriş
                  </label>
                  <div className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {user.lastLoginDate
                      ? format(new Date(user.lastLoginDate), 'Pp', { locale: tr })
                      : 'Henüz giriş yapılmadı'}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Hesap Durumu
                  </label>
                  <div className={`px-4 py-2 rounded-lg ${
                    user.accountStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : user.accountStatus === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.accountStatus === 'active' && 'Aktif'}
                    {user.accountStatus === 'suspended' && 'Askıya Alınmış'}
                    {user.accountStatus === 'inactive' && 'İnaktif'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Öğrenilen Kelimeler
                    </span>
                    <BookOpen size={20} className="text-violet-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {user.learnedWordsCount}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Günlük Seri
                    </span>
                    <Calendar size={20} className="text-violet-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {user.dailyStreak} gün
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Toplam Giriş
                    </span>
                    <Clock size={20} className="text-violet-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {user.stats?.loginCount || 0}
                  </div>
                </div>
              </div>
            </div>
          )}{/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              {user.deviceHistory.map((device, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Phone size={20} className="text-violet-500" />
                      <span className="font-medium">
                        {device.deviceType || 'Bilinmeyen Cihaz'}
                      </span>
                    </div>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {format(new Date(device.loginDate), 'Pp', { locale: tr })}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Tarayıcı</span>
                      <div>{device.browser || 'Bilinmiyor'}</div>
                    </div>
                    <div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>İşletim Sistemi</span>
                      <div>{device.os || 'Bilinmiyor'}</div>
                    </div>
                    <div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>IP Adresi</span>
                      <div>{device.ip || 'Bilinmiyor'}</div>
                    </div>
                  </div>
                </div>
              ))}
              {user.deviceHistory.length === 0 && (
                <div className={`text-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Henüz giriş geçmişi bulunmuyor
                </div>
              )}
            </div>
          )}

          {/* Words Tab */}
          {activeTab === 'words' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Kelime Listesi ({user.words?.length || 0} kelime)
                </h4>
                <div className="flex space-x-2">
                  <select
                    className={`rounded-lg px-3 py-2 ${
                      darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-900'
                    } border focus:ring-2 focus:ring-violet-500`}
                  >
                    <option value="all">Tüm Kelimeler</option>
                    <option value="learned">Öğrenilmiş</option>
                    <option value="notLearned">Öğrenilmemiş</option>
                  </select>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className="px-4 py-2 text-left">Lehçe</th>
                      <th className="px-4 py-2 text-left">Türkçe</th>
                      <th className="px-4 py-2 text-center">Durum</th>
                      <th className="px-4 py-2 text-center">Zorluk</th>
                      <th className="px-4 py-2 text-right">Son İnceleme</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {user.words?.map((word, index) => (
                      <tr key={index} className={
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                      }>
                        <td className="px-4 py-2">{word.polish}</td>
                        <td className="px-4 py-2">{word.turkish}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            word.learned
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {word.learned ? 'Öğrenildi' : 'Öğrenilmedi'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            word.difficulty === 'Kolay'
                              ? 'bg-blue-100 text-blue-800'
                              : word.difficulty === 'Orta'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {word.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          {word.lastReviewed
                            ? format(new Date(word.lastReviewed), 'Pp', { locale: tr })
                            : 'Henüz incelenmedi'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!user.words || user.words.length === 0) && (
                  <div className={`text-center py-8 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Henüz kelime listesi bulunmuyor
                  </div>
                )}
              </div>
            </div>
          )}{/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Admin Notları
                </h4>
                <button
                  onClick={onAddNote}
                  className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white"
                >
                  Not Ekle
                </button>
              </div>

              {user.adminNotes?.map((note, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle size={20} className="text-violet-500" />
                      <span className="font-medium">
                        {note.createdBy?.username || 'Bilinmeyen Admin'}
                      </span>
                    </div>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {format(new Date(note.createdAt), 'Pp', { locale: tr })}
                    </span>
                  </div>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {note.note}
                  </p>
                </div>
              ))}
              {(!user.adminNotes || user.adminNotes.length === 0) && (
                <div className={`text-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Henüz not bulunmuyor
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Ana AdminPanel bileşeni
const AdminPanel = ({ darkMode, apiUrl }) => {
  // State tanımlamaları
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    deviceType: 'all',
    minStreak: '',
    minWords: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });// Yardımcı fonksiyonlar
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Kullanıcıları getirme fonksiyonu
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction,
        status: filterConfig.status,
        dateFrom: filterConfig.dateFrom,
        dateTo: filterConfig.dateTo,
        deviceType: filterConfig.deviceType,
        minStreak: filterConfig.minStreak,
        minWords: filterConfig.minWords
      });

      const response = await fetch(`${apiUrl}/admin/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Kullanıcılar yüklenemedi');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      showNotification('error', 'Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, currentPage, searchTerm, sortConfig, filterConfig, showNotification]);

  // Kullanıcıları yükle
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Kullanıcı güncelleme
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${updatedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Güncelleme başarısız');
      }

      showNotification('success', 'Kullanıcı başarıyla güncellendi');
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      showNotification('error', 'Kullanıcı güncellenirken bir hata oluştu');
    }
  };

  // Sıralama işlemi
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Filtreleme işlemi
  const handleFilter = useCallback((e) => {
    const { name, value } = e.target;
    setFilterConfig(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  // Kullanıcı silme
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız');
      }

      showNotification('success', 'Kullanıcı başarıyla silindi');
      await fetchUsers();
    } catch (error) {
      console.error('Silme hatası:', error);
      showNotification('error', 'Kullanıcı silinirken bir hata oluştu');
    }
  };

  // Toplu işlem
  const handleBulkAction = async (action) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/bulk-${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userIds: bulkSelection })
      });

      if (!response.ok) {
        throw new Error('Toplu işlem başarısız');
      }

      showNotification('success', 'Toplu işlem başarıyla tamamlandı');
      setBulkSelection([]);
      await fetchUsers();
    } catch (error) {
      console.error('Toplu işlem hatası:', error);
      showNotification('error', 'Toplu işlem sırasında bir hata oluştu');
    }
  };// Not ekleme fonksiyonu
  const handleAddNote = async (userId, note) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${userId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ note })
      });

      if (!response.ok) {
        throw new Error('Not ekleme başarısız');
      }

      showNotification('success', 'Not başarıyla eklendi');
      setIsAddingNote(false);
      await fetchUsers();
    } catch (error) {
      console.error('Not ekleme hatası:', error);
      showNotification('error', 'Not eklenirken bir hata oluştu');
    }
  };

  // Dışa aktarma fonksiyonu
  const handleExportData = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/export`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Dışa aktarma başarısız');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showNotification('success', 'Veriler başarıyla dışa aktarıldı');
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
      showNotification('error', 'Veriler dışa aktarılırken bir hata oluştu');
    }
  };

  // Grid görünümü render fonksiyonu
  const renderUserGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <motion.div
          key={user._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
          } cursor-pointer transition-colors`}
          onClick={() => setSelectedUserDetail(user)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.username}
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {user.email}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.accountStatus === 'active'
                ? 'bg-green-100 text-green-800'
                : user.accountStatus === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {user.accountStatus === 'active' && 'Aktif'}
              {user.accountStatus === 'suspended' && 'Askıya Alınmış'}
              {user.accountStatus === 'inactive' && 'İnaktif'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Öğrenilen Kelimeler
              </p>
              <p className="font-medium">{user.learnedWordsCount}</p>
            </div>
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Günlük Seri
              </p>
              <p className="font-medium">{user.dailyStreak} gün</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
              }}
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                darkMode
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user._id);
              }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );// Ana render
  return (
    <>
      <div className={`${
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      } min-h-screen p-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold flex items-center gap-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Users className={darkMode ? 'text-violet-400' : 'text-violet-600'} size={32} />
                Kullanıcı Yönetimi
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Toplam {users.length} kullanıcı
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportData}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Download size={20} />
                <span>Dışa Aktar</span>
              </button>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 ${
                    viewMode === 'table'
                      ? 'bg-violet-500 text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-white text-gray-700'
                  }`}
                >
                  <i className="fas fa-table" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 ${
                    viewMode === 'grid'
                      ? 'bg-violet-500 text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-white text-gray-700'
                  }`}
                >
                  <i className="fas fa-th-large" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtreler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500`}
              />
            </div>

            <select
              name="status"
              value={filterConfig.status}
              onChange={handleFilter}
              className={`rounded-lg px-3 py-2 ${
                darkMode
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500`}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="suspended">Askıya Alınmış</option>
              <option value="inactive">İnaktif</option>
            </select>

            <input
              type="date"
              name="dateFrom"
              value={filterConfig.dateFrom}
              onChange={handleFilter}
              className={`rounded-lg px-3 py-2 ${
                darkMode
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500`}
            />

            <input
              type="date"
              name="dateTo"
              value={filterConfig.dateTo}
              onChange={handleFilter}
              className={`rounded-lg px-3 py-2 ${
                darkMode
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-violet-500`}
            />
          </div>

          {/* Ana İçerik */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-8 h-8 border-2 rounded-full ${
                  darkMode
                    ? 'border-violet-500 border-t-transparent'
                    : 'border-violet-600 border-t-transparent'
                }`}
              />
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className="w-8 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={bulkSelection.length === users.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelection(users.map(user => user._id));
                          } else {
                            setBulkSelection([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    {[
                      { key: 'username', label: 'Kullanıcı Adı' },
                      { key: 'email', label: 'E-posta' },
                      { key: 'learnedWordsCount', label: 'Öğrenilen Kelimeler' },
                      { key: 'dailyStreak', label: 'Günlük Seri' },
                      { key: 'lastLoginDate', label: 'Son Giriş' },
                      { key: 'accountStatus', label: 'Durum' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{label}</span>
                          {sortConfig.key === key && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3">İşlemler</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>{users.map(user => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={bulkSelection.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelection(prev => [...prev, user._id]);
                            } else {
                              setBulkSelection(prev => prev.filter(id => id !== user._id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 text-center">{user.learnedWordsCount}</td>
                      <td className="px-4 py-3 text-center">{user.dailyStreak}</td>
                      <td className="px-4 py-3">
                        {user.lastLoginDate
                          ? format(new Date(user.lastLoginDate), 'Pp', { locale: tr })
                          : 'Henüz giriş yapılmadı'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.accountStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.accountStatus === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.accountStatus === 'active' && 'Aktif'}
                          {user.accountStatus === 'suspended' && 'Askıya Alınmış'}
                          {user.accountStatus === 'inactive' && 'İnaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedUserDetail(user)}
                            className={`p-1 rounded-lg ${
                              darkMode
                                ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                                : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                            }`}
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedUser(user)}
                            className={`p-1 rounded-lg ${
                              darkMode
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteUser(user._id)}
                            className={`p-1 rounded-lg ${
                              darkMode
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            renderUserGrid()
          )}

          {/* Sayfalama */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={20} />
              <span>Önceki</span>
            </button>

            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Sayfa {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              } ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Sonraki</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>{/* Bulk Actions */}
      {bulkSelection.length > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {bulkSelection.length} kullanıcı seçildi
              </span>
              <button
                onClick={() => setBulkSelection([])}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Etkinleştir
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Askıya Al
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedUser && (
          <UserEditModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleUpdateUser}
            darkMode={darkMode}
          />
        )}

        {selectedUserDetail && (
          <UserDetailModal
            user={selectedUserDetail}
            onClose={() => setSelectedUserDetail(null)}
            darkMode={darkMode}
            onAddNote={() => {
              setSelectedUserDetail(null);
              setIsAddingNote(true);
            }}
          />
        )}

        {isAddingNote && (
          <AddNoteModal
            onClose={() => setIsAddingNote(false)}
            onSave={handleAddNote}
            darkMode={darkMode}
            userId={selectedUserDetail?._id}
          />
        )}
      </AnimatePresence>

      {/* Bildirimler */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'error'
                ? darkMode
                  ? 'bg-red-900 text-red-100'
                  : 'bg-red-100 text-red-900'
                : darkMode
                  ? 'bg-green-900 text-green-100'
                  : 'bg-green-100 text-green-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Check size={20} />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
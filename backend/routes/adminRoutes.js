const express = require('express');
const router = express.Router();
const User = require('../models/User');
const WordList = require('../models/WordList');
const authenticateToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Tüm kullanıcıları getir
router.get('/admin/users', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const userStatus = req.query.userStatus || 'all';

    // Filtreleme kriterleri
    const filterCriteria = {
      isAdmin: false // Admin kullanıcıları hariç tut
    };

    // Arama filtresi
    if (search) {
      filterCriteria.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Kullanıcı durumu filtresi
    if (userStatus !== 'all') {
      if (userStatus === 'active') {
        filterCriteria.lastLoginDate = { $ne: null };
      } else if (userStatus === 'inactive') {
        filterCriteria.lastLoginDate = null;
      }
    }

    // Sayfalama ve sıralama ile kullanıcıları getir
    const users = await User.find(filterCriteria)
      .select('-password')
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Toplam kullanıcı sayısı
    const total = await User.countDocuments(filterCriteria);

    res.json({
      users,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kullanıcı detaylarını getir
router.get('/admin/users/:userId', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    console.error('Kullanıcı detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kullanıcı güncelle
router.put('/admin/users/:userId', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const { username, email, learnedWordsCount, dailyStreak } = req.body;

    // Eğer username veya email değişiyorsa, benzersiz olduğunu kontrol et
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.params.userId } },
          {
            $or: [
              { username: username },
              { email: email }
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Bu kullanıcı adı veya email zaten kullanımda'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          ...(username && { username }),
          ...(email && { email }),
          ...(learnedWordsCount !== undefined && { learnedWordsCount }),
          ...(dailyStreak !== undefined && { dailyStreak }),
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      message: 'Kullanıcı başarıyla güncellendi',
      user: updatedUser
    });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kullanıcı sil
router.delete('/admin/users/:userId', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: 'Admin kullanıcıları silinemez' });
    }

    await user.remove();
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kelime listesi endpoint'leri
router.post('/admin/wordlist', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const { words } = req.body;

    if (!words || !Array.isArray(words)) {
      return res.status(400).json({
        message: 'Geçersiz kelime listesi formatı'
      });
    }

    // Mevcut varsayılan listeyi pasif yap
    await WordList.updateMany(
      { isDefault: true },
      { $set: { isDefault: false } }
    );

    // Yeni kelime listesi oluştur
    const wordList = new WordList({
      words,
      isDefault: true,
      createdBy: req.user.userId
    });

    await wordList.save();

    // Tüm kullanıcıların kelime listesini güncelle
    await User.updateMany(
      {},
      {
        $set: {
          defaultWordList: wordList._id,
          words: words
        }
      }
    );

    res.json({
      message: 'Kelime listesi başarıyla güncellendi',
      wordList
    });
  } catch (error) {
    console.error('Kelime listesi yükleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Varsayılan kelime listesini getir
router.get('/admin/wordlist/default', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const defaultList = await WordList.findOne({ isDefault: true })
      .populate('createdBy', 'username');

    if (!defaultList) {
      return res.status(404).json({ message: 'Varsayılan kelime listesi bulunamadı' });
    }

    res.json(defaultList);
  } catch (error) {
    console.error('Varsayılan liste getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Tüm kelime listelerini getir
router.get('/admin/wordlists', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const lists = await WordList.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    console.error('Kelime listeleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Admin istatistikleri endpoint'i
router.get('/admin/stats', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeUsers = await User.countDocuments({
      isAdmin: false,
      lastLoginDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const totalWordLists = await WordList.countDocuments();

    // Son 7 günlük kayıt istatistikleri
    const last7Days = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          isAdmin: false
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalWordLists,
      registrationStats: last7Days,
      activeUsersPercentage: (activeUsers / totalUsers * 100).toFixed(2)
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
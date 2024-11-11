// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const GameStats = require('../models/GameStats');
const Achievement = require('../models/Achievement');
const PowerUp = require('../models/PowerUp');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware');

// Oyun skoru kaydetme
router.post('/games/score', authenticateToken, async (req, res) => {
  try {
    const { gameType, difficulty, score, wordsLearned, maxCombo, maxStreak,
            powerUpsUsed, timeSpent } = req.body;

    // Yeni skor kaydı oluştur
    const gameStats = new GameStats({
      userId: req.user.userId,
      gameType,
      difficulty,
      score,
      wordsLearned,
      maxCombo,
      maxStreak,
      powerUpsUsed,
      timeSpent
    });
    await gameStats.save();

    // Kullanıcı istatistiklerini güncelle
    const user = await User.findById(req.user.userId);
    user.learnedWordsCount += wordsLearned;
    user.stats = user.stats || {};
    user.stats.totalScore = (user.stats.totalScore || 0) + score;
    user.stats.gamesPlayed = (user.stats.gamesPlayed || 0) + 1;
    await user.save();

    // Başarımları kontrol et
    await checkAchievements(req.user.userId, gameType, {
      score,
      wordsLearned,
      maxCombo,
      maxStreak
    });

    // En yüksek skorları getir
    const userBest = await GameStats.getUserBest(req.user.userId, gameType);
    const globalTop = await GameStats.find({ gameType })
      .sort('-score')
      .limit(10)
      .populate('userId', 'username profileImage');

    res.json({
      message: 'Skor kaydedildi',
      gameStats,
      userBest,
      globalTop
    });
  } catch (error) {
    console.error('Skor kaydetme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Sıralama tablosu getirme
router.get('/games/leaderboard/:gameType', authenticateToken, async (req, res) => {
  try {
    const { gameType } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const leaderboard = await GameStats.find({ gameType })
      .sort('-score')
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate('userId', 'username profileImage')
      .lean();

    // Kullanıcının sıralamasını bul
    const userRank = await GameStats.countDocuments({
      gameType,
      score: { $gt: (await GameStats.getUserBest(req.user.userId, gameType))?.score || 0 }
    }) + 1;

    res.json({
      leaderboard,
      userRank,
      total: await GameStats.countDocuments({ gameType })
    });
  } catch (error) {
    console.error('Sıralama getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Güç yükseltmesi kullanma
router.post('/games/power-up/use', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body;

    const powerUp = await PowerUp.findOne({
      userId: req.user.userId,
      type
    });

    if (!powerUp || powerUp.count <= 0) {
      return res.status(400).json({
        message: 'Yetersiz güç yükseltmesi'
      });
    }

    await powerUp.use();

    res.json({
      message: 'Güç yükseltmesi kullanıldı',
      remainingCount: powerUp.count
    });
  } catch (error) {
    console.error('Güç yükseltmesi kullanma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Başarımları kontrol etme yardımcı fonksiyonu
async function checkAchievements(userId, gameType, stats) {
  try {
    const achievements = await Achievement.find({
      userId,
      gameType,
      completed: false
    });

    for (const achievement of achievements) {
      switch (achievement.type) {
        case 'score':
          achievement.progress.current = Math.max(achievement.progress.current, stats.score);
          break;
        case 'combo':
          achievement.progress.current = Math.max(achievement.progress.current, stats.maxCombo);
          break;
        case 'streak':
          achievement.progress.current = Math.max(achievement.progress.current, stats.maxStreak);
          break;
        case 'words_learned':
          achievement.progress.current += stats.wordsLearned;
          break;
      }

      const completed = await achievement.checkProgress();
      if (completed) {
        // Ödülü ver
        const user = await User.findById(userId);

        switch (achievement.reward.type) {
          case 'xp':
            user.stats.xp = (user.stats.xp || 0) + achievement.reward.value;
            break;
          case 'power_up':
            let powerUp = await PowerUp.findOne({
              userId,
              type: achievement.reward.value.type
            });
            if (!powerUp) {
              powerUp = new PowerUp({
                userId,
                type: achievement.reward.value.type
              });
            }
            await powerUp.add(achievement.reward.value.count);
            break;
        }

        await user.save();
      }
    }
  } catch (error) {
    console.error('Başarım kontrolü hatası:', error);
  }
}

module.exports = router;
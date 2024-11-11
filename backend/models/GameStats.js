// models/GameStats.js
const mongoose = require('mongoose');

const GameStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'puzzle', 'speed'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  wordsLearned: {
    type: Number,
    default: 0
  },
  maxCombo: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  powerUpsUsed: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // Saniye cinsinden
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Global sıralama için index
GameStatsSchema.index({ gameType: 1, score: -1 });
// Kullanıcı bazlı sıralama için index
GameStatsSchema.index({ userId: 1, gameType: 1, score: -1 });

// Virtual fields
GameStatsSchema.virtual('pointsPerMinute').get(function() {
  return Math.round((this.score / (this.timeSpent / 60)) * 100) / 100;
});

// Statik metodlar
GameStatsSchema.statics.getLeaderboard = async function(gameType, limit = 10) {
  return this.find({ gameType })
    .sort('-score')
    .limit(limit)
    .populate('userId', 'username profileImage');
};

GameStatsSchema.statics.getUserBest = async function(userId, gameType) {
  return this.findOne({ userId, gameType })
    .sort('-score')
    .exec();
};

module.exports = mongoose.model('GameStats', GameStatsSchema);

// models/Achievement.js
const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'puzzle', 'speed', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      required: true
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  reward: {
    type: {
      type: String,
      enum: ['xp', 'power_up', 'badge'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }
}, {
  timestamps: true
});

// Başarım kontrol metodu
AchievementSchema.methods.checkProgress = async function() {
  if (this.progress.current >= this.progress.target && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

module.exports = mongoose.model('Achievement', AchievementSchema);

// models/PowerUp.js
const PowerUpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['timeFreeze', 'doublePoints', 'extraLife', 'hint'],
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastRefillAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Güç yükseltmesi kullanma metodu
PowerUpSchema.methods.use = async function() {
  if (this.count <= 0) {
    throw new Error('Yetersiz güç yükseltmesi');
  }
  this.count -= 1;
  await this.save();
  return true;
};

// Güç yükseltmesi ekleme metodu
PowerUpSchema.methods.add = async function(amount = 1) {
  this.count += amount;
  this.lastRefillAt = new Date();
  await this.save();
  return this.count;
};

module.exports = mongoose.model('PowerUp', PowerUpSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı zorunludur'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır']
  },
  email: {
    type: String,
    required: [true, 'Email zorunludur'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  profileImage: {
    type: String,
    default: null
  },
  learnedWordsCount: {
    type: Number,
    default: 0
  },
  dailyStreak: {
    type: Number,
    default: 0
  },
  lastStreakUpdate: {
    type: Date,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  words: [{
    polish: String,
    turkish: String,
    phonetic: String,
    example: String,
    translation: String,
    difficulty: {
      type: String,
      enum: ['Kolay', 'Orta', 'Zor'],
      default: 'Orta'
    },
    learned: {
      type: Boolean,
      default: false
    },
    lastReviewed: {
      type: Date,
      default: null
    }
  }],
  defaultWordList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordList'
  },
  lastLoginDate: {
    type: Date,
    default: null
  },
  preferences: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  stats: {
    totalStudyTime: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Sanal alanlar
UserSchema.virtual('wordsCount').get(function() {
  return this.words ? this.words.length : 0;
});

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLoginDate')) {
    // Kullanıcı giriş yaptığında streak kontrolü
    const now = new Date();
    const lastUpdate = this.lastStreakUpdate;

    if (!lastUpdate) {
      this.lastStreakUpdate = now;
      this.dailyStreak = 1;
    } else {
      const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Ardışık gün
        this.dailyStreak += 1;
        this.lastStreakUpdate = now;
      } else if (diffDays > 1) {
        // Streak kırıldı
        this.dailyStreak = 1;
        this.lastStreakUpdate = now;
      }
      // Aynı gün içinde tekrar giriş yaparsa streak değişmez
    }
  }
  next();
});

// Yardımcı metodlar
UserSchema.methods.updateLearnedWordsCount = function() {
  this.learnedWordsCount = this.words.filter(word => word.learned).length;
  return this.save();
};

UserSchema.methods.updateLastStudyDate = function() {
  this.stats.lastStudyDate = new Date();
  return this.save();
};

UserSchema.methods.addStudyTime = function(minutes) {
  this.stats.totalStudyTime += minutes;
  return this.save();
};

UserSchema.methods.updateAccuracy = function(accuracy) {
  if (this.stats.averageAccuracy === 0) {
    this.stats.averageAccuracy = accuracy;
  } else {
    this.stats.averageAccuracy = (this.stats.averageAccuracy + accuracy) / 2;
  }
  return this.save();
};

// Statik metodlar
UserSchema.statics.getActiveUsers = function(days = 30) {
  return this.find({
    lastLoginDate: {
      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }
  });
};

UserSchema.statics.getTopLearners = function(limit = 10) {
  return this.find()
    .sort('-learnedWordsCount')
    .limit(limit)
    .select('username learnedWordsCount');
};

module.exports = mongoose.model('User', UserSchema);
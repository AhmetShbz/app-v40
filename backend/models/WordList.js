const mongoose = require('mongoose');

const WordListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Liste adı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  words: [{
    polish: {
      type: String,
      required: [true, 'Lehçe kelime zorunludur'],
      trim: true
    },
    turkish: {
      type: String,
      required: [true, 'Türkçe çeviri zorunludur'],
      trim: true
    },
    phonetic: {
      type: String,
      trim: true
    },
    example: {
      type: String,
      trim: true
    },
    translation: {
      type: String,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Kolay', 'Orta', 'Zor'],
      default: 'Orta'
    },
    category: {
      type: String,
      enum: ['Genel', 'Günlük Konuşma', 'İş', 'Akademik', 'Diğer'],
      default: 'Genel'
    },
    tags: [String]
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
WordListSchema.index({ name: 'text', 'words.polish': 'text', 'words.turkish': 'text' });

// Pre-save middleware
WordListSchema.pre('save', async function(next) {
  if (this.isModified('isDefault') && this.isDefault) {
    // Diğer varsayılan listeleri pasif yap
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Sanal alanlar
WordListSchema.virtual('wordCount').get(function() {
  return this.words.length;
});

WordListSchema.virtual('difficultyStats').get(function() {
  return {
    easy: this.words.filter(w => w.difficulty === 'Kolay').length,
    medium: this.words.filter(w => w.difficulty === 'Orta').length,
    hard: this.words.filter(w => w.difficulty === 'Zor').length
  };
});

// Instance metodları
WordListSchema.methods.addRating = function(newRating) {
  const oldTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (oldTotal + newRating) / this.rating.count;
  return this.save();
};

WordListSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

WordListSchema.methods.archive = function() {
  if (this.isDefault) {
    throw new Error('Varsayılan liste arşivlenemez');
  }
  this.status = 'archived';
  return this.save();
};

// Statik metodlar
WordListSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({
    'words.difficulty': difficulty,
    status: 'active'
  });
};

WordListSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort('-usageCount')
    .limit(limit);
};

WordListSchema.statics.findByCategory = function(category) {
  return this.find({
    'words.category': category,
    status: 'active'
  });
};

module.exports = mongoose.model('WordList', WordListSchema);
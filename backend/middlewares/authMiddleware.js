const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Kimlik doğrulama token\'ı bulunamadı'
      });
    }

    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı doğrula ve bilgilerini güncelle
    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(401).json({
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Son giriş tarihini güncelle
    await User.findByIdAndUpdate(user._id, {
      $set: { lastLoginDate: new Date() }
    });

    // Request nesnesine kullanıcı bilgilerini ekle
    req.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Oturum süresi doldu, lütfen tekrar giriş yapın'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Geçersiz token'
      });
    }
    console.error('Auth middleware hatası:', error);
    res.status(500).json({
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

module.exports = authenticateToken;
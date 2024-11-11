const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: 'Kimlik doğrulama gerekli'
      });
    }

    const user = await User.findById(req.user.userId).select('isAdmin');

    if (!user) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: 'Bu işlem için admin yetkisi gerekiyor'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware hatası:', error);
    res.status(500).json({
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

module.exports = adminMiddleware;
// backend/src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ 
        where: { email, isActive: true },
        include: ['Business']
      });

      if (!admin || !(await admin.validatePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: admin.id, 
          businessId: admin.businessId,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          business: admin.Business
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async validateToken(req, res) {
    res.json({ valid: true, user: req.user });
  }
}

module.exports = new AuthController();

// backend/src/middleware/business.middleware.js
const businessMiddleware = (req, res, next) => {
    // Extract business ID from various sources
    const businessId = req.body.businessId || 
                      req.query.businessId || 
                      req.params.businessId ||
                      req.headers['x-business-id'];
  
    if (!businessId && !req.user) {
      return res.status(400).json({ error: 'Business ID required' });
    }
  
    req.businessId = businessId || req.user?.businessId;
    next();
  };
  
  module.exports = businessMiddleware;
  
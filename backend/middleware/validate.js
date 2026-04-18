const validator = require('validator');

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  if (!normalize(firstName)) errors.push('First name is required');
  if (!normalize(lastName)) errors.push('Last name is required');
  if (!validator.isEmail(normalize(email || ''))) errors.push('Valid email is required');
  if (!validator.isLength(normalize(password || ''), { min: 8 })) errors.push('Password must be at least 8 characters');

  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!validator.isEmail(normalize(email || ''))) errors.push('Valid email is required');
  if (!normalize(password)) errors.push('Password is required');

  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateBookingCreate = (req, res, next) => {
  const { userId, journeyId, bundleId, paymentMethod, totalAmount } = req.body;
  const errors = [];

  if (!normalize(userId)) errors.push('userId is required');
  if (!normalize(journeyId)) errors.push('journeyId is required');
  if (!normalize(bundleId)) errors.push('bundleId is required');
  if (!['upi', 'card', 'netbanking', 'wallet'].includes(normalize(paymentMethod))) errors.push('paymentMethod must be one of upi, card, netbanking, wallet');
  if (typeof totalAmount !== 'number' && typeof totalAmount !== 'string') errors.push('totalAmount is required');

  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateBookingCreate,
};
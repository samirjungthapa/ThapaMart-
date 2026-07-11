// Middleware to validate incoming request bodies for user registration and login
export const validateRegister = (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!phone || !/^[0-9+\-\s()]{7,15}$/.test(phone)) {
    return res.status(400).json({ message: 'A valid phone number is required (7-15 digits)' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character.'
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};

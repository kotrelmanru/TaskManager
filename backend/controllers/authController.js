/* controllers/authController.js */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Register with password
exports.registerUser = async (req, res) => {
  try {
    const { name, username, password, preferred_timezone } = req.body;
    // Validasi password
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }
    // Cek ketersediaan username
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username sudah terpakai' });
    }
    // Buat user baru
    const user = new User({ name, username, password, preferred_timezone });
    await user.save();
    // Generate JWT
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Kirim respons termasuk user info
    res.status(201).json({
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        preferred_timezone: user.preferred_timezone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login requires password
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Cari user dan sertakan password
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    // Verifikasi password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Password salah' });
    }
    // Generate JWT
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Kirim respons termasuk user info
    res.json({
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        preferred_timezone: user.preferred_timezone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get profile user
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password -_id');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (for participant selection)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('id name username preferred_timezone');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
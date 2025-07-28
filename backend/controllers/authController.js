const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtp = require('../utils/sendOtp');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  const { name, email, password, specialization } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      specialization,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await user.save();
    await sendOtp(email, otp);
    res.status(201).json({ message: 'Signup successful. OTP sent to email.' });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists or other error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'OTP verified', token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ message: 'Login successful', token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtp(email, otp);
  res.json({ message: 'OTP sent to your email' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};

const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('department')
    .isIn(['inventory', 'sales', 'procurement', 'technical', 'finance'])
    .withMessage('Please select a valid department'),
  body('employeeId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Employee ID must be between 3 and 20 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Invalid role specified'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Routes - Registration removed from public access
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);
router.post('/logout', protect, logout);

// Admin routes
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.post('/admin/create-user', protect, adminOnly, registerValidation, createUserByAdmin);
router.put('/admin/users/:id', protect, adminOnly, updateUserByAdmin);
router.delete('/admin/users/:id', protect, adminOnly, deleteUserByAdmin);

module.exports = router;

const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  logout,
  getAccessToken,
  getMe,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUser,
  removeUser,
} = require('../controllers/userController')

const { protect, restrictTo } = require('../middleware/authMiddleware')

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.post('/', registerUser)
router.post('/login', loginUser)

router.delete('/logout', protect, logout)
router.get('/me', protect, getMe)
router.post('/token', protect, getAccessToken)

router.get('/', protect, restrictTo, getAllUsers)
router
  .route('/:id')
  .get(protect, restrictTo, getUser)
  .delete(protect, restrictTo, removeUser)

module.exports = router

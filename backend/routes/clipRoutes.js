const express = require('express')
const router = express.Router()

const {
  addClip,
  deleteClip,
  deleteAllClips,
  getClips,
} = require('../controllers/clipController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getClips)
  .post(protect, addClip)
  .delete(protect, deleteAllClips)
router.delete('/:id', protect, deleteClip)

module.exports = router

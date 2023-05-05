const express = require('express')
const router = express.Router()
const {
  addStreamer,
  deleteStreamer,
  deleteAllStreamers,
  getStreamers,
  importStreamers,
} = require('../controllers/streamerController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getStreamers)
  .post(protect, addStreamer)
  .delete(protect, deleteAllStreamers)
router.delete('/:id', protect, deleteStreamer)
router.post('/import', protect, importStreamers)

module.exports = router

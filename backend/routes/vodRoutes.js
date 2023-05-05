const express = require('express')
const router = express.Router()
const {
  addVod,
  deleteVod,
  deleteAllVods,
  getVods,
} = require('../controllers/vodController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getVods)
  .post(protect, addVod)
  .delete(protect, deleteAllVods)
router.delete('/:id', protect, deleteVod)

module.exports = router

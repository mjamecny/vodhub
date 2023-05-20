const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc add vod
// @route POST /api/vods
// @access Private

const addVod = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ _id: req.user.id })

  if (user.vodIds.includes(id)) {
    return res.status(400).json({
      message: 'VOD already in your favorites',
    })
  }
  user.vodIds.push(id)
  await user.save()
  res.status(201).json({
    message: 'Vod added to your favorites',
  })
})

// @desc delete vod
// @route DELETE /api/vods/:id
// @access Private

const deleteVod = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: req.user.id })

  if (!user.vodIds.includes(id)) {
    return res.status(400).json({
      message: 'VOD not found in your favorites',
    })
  }

  user.vodIds = user.vodIds.filter((vodId) => vodId !== id && vodId !== null)
  await user.save()

  res.status(200).json({
    message: 'Vod removed from your favorites',
  })
})

// @desc delete all vods
// @route DELETE /api/vods
// @access Private

const deleteAllVods = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })

  user.vodIds = []
  await user.save()

  res.status(200).json({
    message: 'All VODs removed from your favorites',
  })
})

// @desc get all vods
// @route GET /api/vods
// @access Private

const getVods = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })
  res.status(201).json({ vods: user.vodIds })
})

module.exports = {
  addVod,
  deleteVod,
  deleteAllVods,
  getVods,
}

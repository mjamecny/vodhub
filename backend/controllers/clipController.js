const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const AppError = require('../utils/appError')

// @desc add clip
// @route POST /api/clips
// @access Private

const addClip = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  if (user.clipIds.includes(id)) {
    return next(new AppError('Clip already in your favorites', 409))
  }

  user.clipIds.push(id)
  await user.save()

  res.status(201).json({
    message: 'Clip added to your favorites',
  })
})

// @desc delete vod
// @route DELETE /api/vods/:id
// @access Private

const deleteClip = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  if (!user.clipIds.includes(id)) {
    return next(new AppError('Clip not found in your favorites', 404))
  }

  user.clipIds = user.clipIds.filter(
    (clipId) => clipId !== id && clipId !== null
  )

  await user.save()

  res.status(200).json({
    message: 'Clip removed from your favorites',
  })
})

// @desc delete all vods
// @route DELETE /api/vods
// @access Private

const deleteAllClips = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  user.clipIds = []
  await user.save()

  res.status(200).json({
    message: 'All Clips removed from your favorites',
  })
})

const getClips = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })
  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }
  res.status(201).json({ clips: user.clipIds })
})

module.exports = {
  addClip,
  deleteClip,
  deleteAllClips,
  getClips,
}

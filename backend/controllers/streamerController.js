const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const AppError = require('../utils/appError')

// @desc add streamer
// @route POST /api/streamers
// @access Private

const addStreamer = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  if (user.streamerIds.includes(id)) {
    return next(new AppError('Streamer already in your favorites', 409))
  }

  user.streamerIds.push(id)
  await user.save()
  res.status(201).json({
    message: 'Streamer added to your favorites',
  })
})

// @desc delete streamer
// @route DELETE /api/streamers/:id
// @access Private

const deleteStreamer = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  if (!user.streamerIds.includes(id)) {
    return next(new AppError('Streamer not found in your favorites', 404))
  }

  user.streamerIds = user.streamerIds.filter(
    (streamerId) => streamerId !== id && streamerId !== null
  )
  await user.save()

  res.status(200).json({
    message: 'Streamer removed from your favorites',
  })
})

// @desc delete all streamers
// @route DELETE /api/streamers
// @access Private

const deleteAllStreamers = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  user.streamerIds = []
  await user.save()

  res.status(200).json({
    message: 'All streamers removed from your favorites',
  })
})

const getStreamers = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  res.status(201).json({ streamers: user.streamerIds })
})

// @desc import streamers
// @route POST /api/streamers/import
// @access Private

const importStreamers = asyncHandler(async (req, res) => {
  const { streamerIds } = req.body

  if (!streamerIds || !Array.isArray(streamerIds)) {
    return next(
      new AppError('Invalid input: streamerIds should be an array', 400)
    )
  }

  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('The user does no longer exist.', 401))
  }

  // filter out streamerIds that are already in the user's list
  const newStreamers = streamerIds.filter(
    (id) => !user.streamerIds.includes(id)
  )

  user.streamerIds.push(...newStreamers)
  await user.save()

  res.status(201).json({
    message: `${newStreamers.length} new streamers added to your favorites`,
    newStreamers,
  })
})

module.exports = {
  addStreamer,
  deleteStreamer,
  deleteAllStreamers,
  getStreamers,
  importStreamers,
}

const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc add streamer
// @route POST /api/streamers
// @access Private

const addStreamer = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ _id: req.user.id })

  if (user.streamerIds.includes(id)) {
    return res.status(400).json({
      message: 'Streamer already in your favorites',
    })
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

  if (!user.streamerIds.includes(id)) {
    return res.status(400).json({
      message: 'Streamer not found in your favorites',
    })
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

  user.streamerIds = []
  await user.save()

  res.status(200).json({
    message: 'All streamers removed from your favorites',
  })
})

const getStreamers = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })
  res.status(201).json({ streamers: user.streamerIds })
})

// @desc import streamers
// @route POST /api/streamers/import
// @access Private

const importStreamers = asyncHandler(async (req, res) => {
  const { streamerIds } = req.body

  if (!streamerIds || !Array.isArray(streamerIds)) {
    return res.status(400).json({
      message: 'Invalid input: streamerIds should be an array',
    })
  }

  const user = await User.findOne({ _id: req.user.id })

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

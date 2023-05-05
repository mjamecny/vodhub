const mongoose = require('mongoose')

const vodSchema = mongoose.Schema({
  vodId: {
    type: String,
    required: [true, 'Please add a Twitch VOD ID'],
    unique: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Vod', vodSchema)

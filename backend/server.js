const express = require('express')
const path = require('path')
const cors = require('cors')
const colors = require('colors')
const port = process.env.PORT || 5000
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://vodhub.netlify.app',
  })
)

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/vods', require('./routes/vodRoutes'))
app.use('/api/clips', require('./routes/clipRoutes'))
app.use('/api/streamers', require('./routes/streamerRoutes'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

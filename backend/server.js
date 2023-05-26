const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const path = require('path')
const cors = require('cors')
const colors = require('colors')
const port = process.env.PORT || 5000
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

connectDB()

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Body parser, reading data from body into req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Implement CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000']
        : ['https://vodhub.netlify.app'],
  })
)

app.options('*', cors())

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/vods', require('./routes/vodRoutes'))
app.use('/api/clips', require('./routes/clipRoutes'))
app.use('/api/streamers', require('./routes/streamerRoutes'))

app.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const { email, message, subject } = req.body

    if (!email || !message || !subject) {
      next(new AppError(`Email, message or subject are missing`, 404))
    }

    const transporter =
      process.env.NODE_ENV === 'production'
        ? nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 465,
            auth: {
              user: process.env.SENDGRID_USERNAME,
              pass: process.env.SENDGRID_PASSWORD,
            },
          })
        : nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          })

    const mailOptions = {
      from: 'vodhub@mailsac.com',
      to: 'vodhub@mailsac.com',
      subject,
      text: message,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
        <meta charset="utf-8">
      
        <title>Contact form</title>
        <meta name="description" content="contact form">
        <meta name="author" content="SitePoint">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      
        <link rel="stylesheet" href="css/styles.css?v=1.0">
      
      </head>
      
      <body>
        <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">              
              </div>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
              <h3>You've got a new mail from ✉️${req.body.email} </h3>
              <div style="font-size: 16px;">
              <p>Subject: ${req.body.subject}</p>
              <p></p>
              <p>Message: ${req.body.message}</p>
              <p></p>
              <br>
              </div>
            </div>
      </body>
      </html>`,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Email sent' })
  })
)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

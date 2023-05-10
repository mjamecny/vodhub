const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Email = require('../utils/email')
const crypto = require('crypto')
const AppError = require('./../utils/appError')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET)
}

const saveRefreshToken = async (user, token) => {
  const currentUser = await User.findOne({ _id: user.id })

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  currentUser.refreshTokens.push(token)
  await currentUser.save()
}

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)
  const refreshToken = signRefreshToken(user._id)

  // Remove password from output
  user.password = undefined

  saveRefreshToken(user, refreshToken)

  res.status(statusCode).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
    refreshToken,
  })
}

const getAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body.refreshToken

  if (!refreshToken) {
    return next(new AppError('No refresh token', 401))
  }

  if (!req.user.refreshTokens.includes(refreshToken)) {
    return next(new AppError('', 403))
  }

  // 2) Verification token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  const token = signToken(currentUser.id)

  res.status(200).json({
    token,
  })
})

const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== req.body.token
  )

  await user.save()

  res.status(204).json({
    message: 'Successfully logged out',
  })
})

// @desc Register user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  // Send welcome email
  const url = `${req.protocol}://${req.get('host')}/`
  await new Email(newUser, url).sendWelcome()

  createSendToken(newUser, 201, req, res)
})

// @desc Login user
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res, next) => {
  // 1) Get email and password from body
  const { email, password } = req.body

  // 2) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  // 3) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401))
  }

  // 4) If everything ok, send token to client
  createSendToken(user, 200, req, res)
})

// @desc Get user data
// @route POST /api/users/me
// @access Private

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc Forgot password
// @route POST /api/users/forgotPassword
// @access Public

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send it to user's email
  try {
    const resetURL =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/resetPassword/${resetToken}`
        : `https://vodhub.netlify.app/resetPassword/${resetToken}`

    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to your email!',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    )
  }
})

// @desc Reset password
// @route POST /api/users/resetPassword/:token
// @access Public

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res)
})

module.exports = {
  registerUser,
  loginUser,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  getAccessToken,
}

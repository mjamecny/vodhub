const asyncHandler = require('express-async-handler')

// const allowCrossDomain = asyncHandler(async (req, res, next) => {
//   res.header(
//     'Access-Control-Allow-Origin',
//     process.env.NODE_ENV === 'development'
//       ? 'http://localhost:3000'
//       : 'https://vodhub.netlify.app'
//   )

//   next()
// })

const allowCrossDomain = (err, req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000']
      : ['https://vodhub.netlify.app']
  )

  next()
}

module.exports = { allowCrossDomain }

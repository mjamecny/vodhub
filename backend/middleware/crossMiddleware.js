const allowCrossDomain = (err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://vodhub.netlify.app')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

module.exports = { allowCrossDomain }

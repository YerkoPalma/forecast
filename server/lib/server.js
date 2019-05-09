const { promisify } = require('util')

exports.send = send
exports.sendError = sendError
exports.body = body
exports.json = json

function send (res, value) {
  res.statusCode = 200
  if (typeof value === 'object') {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(value))
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.write(value)
  }
  res.end()
}

function sendError (res, error, code = 500) {
  if (error instanceof Error) {
    res.statusCode = code
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(error))
  }
  res.end()
}

function body (req, cb) {
  let body = []
  req.on('data', chunk => {
    body.push(chunk)
  })
  req.on('end', () => {
    body = Buffer.concat(body)
    cb(null, body)
  })
  req.on('error', err => cb(err))
}

async function json (req) {
  const bodyPromise = promisify(body)
  const value = await bodyPromise(req)
  return JSON.parse(value.toString())
}

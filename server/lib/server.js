exports.send = send
exports.sendError = sendError

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

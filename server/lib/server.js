const { promisify } = require('util')

exports.send = send
exports.sendError = sendError
exports.body = body
exports.json = json

/**
 * Send a successful (HTTP 200) response
 * @param {ServerResponse} res Node native server response
 * @param {*} value Value to send
 * @returns {void}
 */
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

/**
 * Send an error response
 * @param {ServerResponse} res Node native server response
 * @param {Error} error Error that raised the response
 * @param {Number} [code=500] Http status code
 * @returns {void}
 */
function sendError (res, error, code = 500) {
  if (error instanceof Error) {
    res.statusCode = code
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(error))
  }
  res.end()
}

/**
 * Parse the buffer data from a Node request (IncomingMessage)
 * @param {IncomingMessage} req Node native server request
 * @param {Function} cb Node style callback to be called when body is ready
 * @returns {void}
 */
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

/**
 * Parse a request body as json
 * @param {IncomingMessage} req Node native server request
 * @returns {Promise<Object>} Returns a promise with the corresponding json body
 */
async function json (req) {
  const bodyPromise = promisify(body)
  const value = await bodyPromise(req)
  return JSON.parse(value.toString())
}

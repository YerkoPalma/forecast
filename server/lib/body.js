const { promisify } = require('util')
exports.body = body
exports.json = json

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

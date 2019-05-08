exports.body = body
exports.json = json

function body (req) {
  let body = []
  req.on('data', chunk => {
    body.push(chunk)
  })
  req.on('end', () => {
    body = Buffer.concat(body)
    return Promise.resolve(body)
  })
  req.on('error', err => Promise.reject(err))
}

async function json (req) {
  const value = await body(req)
  return JSON.parse(value.toString())
}

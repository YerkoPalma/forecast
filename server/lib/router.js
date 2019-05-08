module.exports = class Router {
  constructor () {
    this.routes = {
      GET: new Set(),
      POST: new Set(),
      PUT: new Set()
    }
  }

  request (method, route, fn) {
    const regex = new RegExp(route.replace(/:(\w*)/g, '(.*)').replace(/\//g, '\\/') + '$')
    const paramsNames = parseParams(route)
    this.routes[method].add({
      regex,
      paramsNames,
      handler: fn
    })
  }

  get (route, fn) {
    this.request('GET', route, fn)
  }

  post (route, fn) {
    this.request('POST', route, fn)
  }

  put (route, fn) {
    this.request('PUT', route, fn)
  }

  lookup (req, res) {
    let route
    for (let r of this.routes[req.method]) {
      if (r.regex.test(req.url)) {
        route = r
        break
      }
    }
    if (route) {
      const paramValues = Array.from(route.regex.exec(req.url)).slice(1)
      let params = {}
      paramValues.forEach((p, i) => {
        params[route.paramsNames[i]] = p
      })
      route.handler(req, res, params)
    }
  }
}

function parseParams (route) {
  const regex = /:(\w+)/g
  let match
  let params = []

  while ((match = regex.exec(route)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }
    params.push(match[1])
  }
  return params
}

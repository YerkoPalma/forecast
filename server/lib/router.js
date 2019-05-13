const path = require('path')

/** Litle http router */
class Router {
  /**
   * creates internal routes Set's
   * @param {Function} defaultRoute Default handler when no route match current url
   */
  constructor (defaultRoute) {
    this.routes = {
      GET: new Set(),
      POST: new Set(),
      PUT: new Set()
    }
    if (typeof defaultRoute === 'function') {
      this.default = defaultRoute
    }
  }

  /**
   * Adds a new route to the corresponding internal Set
   * @param {String} method Http method for this route
   * @param {String} route Route path
   * @param {Function} fn Route handler
   * @returns {void}
   */
  request (method, route, fn) {
    const regex = new RegExp(route.replace(/:(\w*)/g, '(.*)').replace(/\//g, '\\/') + '$')
    const paramsNames = parseParams(route)
    this.routes[method].add({
      regex,
      paramsNames,
      handler: fn
    })
  }

  /**
   * Adds a route to the Get Set
   * @param {String} route Route path
   * @param {Function} fn Route handler
   * @returns {void}
   */
  get (route, fn) {
    this.request('GET', route, fn)
  }

  /**
   * Adds a route to the Post Set
   * @param {String} route Route path
   * @param {Function} fn Route handler
   * @returns {void}
   */
  post (route, fn) {
    this.request('POST', route, fn)
  }

  /**
   * Adds a route to the Put Set
   * @param {String} route Route path
   * @param {Function} fn Route handler
   * @returns {void}
   */
  put (route, fn) {
    this.request('PUT', route, fn)
  }

  /**
   * Start the router, search routes and run handlers
   * @param {IncomingMessage} req Node native server request
   * @param {ServerResponse} res Node native server response
   * @returns {void}
   */
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
    } else if (this.default) {
      this.default(req, res, {
        public: path.join(__dirname, '..', '..', 'public'),
        directoryListing: false
      })
    }
  }
}

/**
 * Get an array of params names for a route
 * @private
 * @param {String} route Http route
 * @returns {Array<String>} Params names
 */
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

module.exports = Router

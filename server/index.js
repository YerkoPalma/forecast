const http = require('http')
const Router = require('./lib/router')
const Controller = require('./lib/controller')
const { send, sendError, json } = require('./lib/server')
const redis = require('redis')
const client = redis.createClient()
const controller = new Controller(client)

const router = new Router()

router.get('/api/ciudades', async function handler (req, res) {
  if (Math.random(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    // guardar error en redis
    controller.save('api.errors', {
      codigo: new Date().getTime(),
      message: 'How unfortunate! The API Request Failed',
      method: req.method,
      url: req.url
    })
    // reintentar
    await handler.apply(null, arguments)
    return
  }
  // obtiene lista de ciudades desde redis
  const ciudades = await controller.loadAll('ciudades')
  // TODO:
  // por cada ciudad
  //  obtiene datos de ciudad desde forecast.io
  // retorna arreglo con info de ciudades
  send(res, ciudades) // res.end(JSON.stringify(ciudades))
})
router.get('/api/ciudades/:ciudad', async function handler (req, res, params) {
  if (Math.random(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    // guardar error en redis
    controller.save('api.errors', {
      codigo: new Date().getTime(),
      message: 'How unfortunate! The API Request Failed',
      method: req.method,
      url: req.url
    })
    // reintentar
    await handler.apply(null, arguments)
    return
  }
  // busca :ciudad en redis
  const ciudad = await controller.load(params.ciudad)
  // TODO:
  // obtiene datos de ciudad en forecast.io
  // retorna datos de ciudad
  send(res, Object.assign({}, { codigo: params.ciudad }, ciudad)) // res.end(JSON.stringify(Object.assign({}, { codigo: params.ciudad }, ciudad)))
})
router.post('/api/ciudades', async function handler (req, res) {
  if (Math.random(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    // guardar error en redis
    controller.save('api.errors', {
      codigo: new Date().getTime(),
      message: 'How unfortunate! The API Request Failed',
      method: req.method,
      url: req.url
    })
    // reintentar
    await handler.apply(null, arguments)
    return
  }
  // agrega datos de ciudad a redis
  const ciudad = await json(req)
  const ciudades = await controller.save('ciudades', ciudad)
  send(res, ciudades) // res.end(JSON.stringify(ciudades))
})

const server = http.createServer()

server.on('request', (req, res) => {
  // TODO:
  // guardar en redis información de ciudades iniciales
  router.lookup(req, res)
})

server.listen(3000, () => {
  console.log('listeniig on port 3000')
})

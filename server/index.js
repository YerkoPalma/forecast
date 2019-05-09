const http = require('http')
const Router = require('./lib/router')
const Controller = require('./lib/controller')
const { send, sendError, json, request } = require('./lib/server')
const redis = require('redis')
const client = redis.createClient()
const controller = new Controller(client)
const initialData = require('./init.json')

const router = new Router()
const FORECAST_URL = `https://api.darksky.net/forecast/${process.env.API_KEY}`

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
  // por cada ciudad
  let data = []
  for (let ciudad of ciudades) {
    let { currently } = await request(`${FORECAST_URL}/${ciudad.lat},${ciudad.lang}?units=si`)
    data.push(Object.assign({}, ciudad, { time: new Date(currently.time * 1000), temperature: currently.temperature }))
  }

  send(res, data)
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
  // obtiene datos de ciudad en forecast.io
  const { currently } = await request(`${FORECAST_URL}/${ciudad.lat},${ciudad.lang}?units=si`)
  // retorna datos de ciudad
  send(res, Object.assign({}, { codigo: params.ciudad }, ciudad, { time: new Date(currently.time * 1000), temperature: currently.temperature }))
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
  router.lookup(req, res)
})

server.listen(3000, async () => {
  console.log('listening on port 3000')
  // guardar en redis información de ciudades iniciales
  await controller.saveAll('ciudades', initialData)
})

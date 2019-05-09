const http = require('http')
const Router = require('./lib/router')
const { json } = require('./lib/body')
const { send, sendError } = require('./lib/server')
const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient()

const hmset = promisify(client.hmset).bind(client)
const hgetall = promisify(client.hgetall).bind(client)
const set = promisify(client.set).bind(client)
const get = promisify(client.get).bind(client)

const router = new Router()

router.get('/api/ciudades', async (req, res) => {
  if (Math.rand(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    // TODO:
    // guardar error en redis
    // reintentar
    return
  }
  // obtiene lista de ciudades desde redis
  const allKeys = (await get('ciudades')).split(',').filter(key => key !== 'api.errors')
  const ciudades = await Promise.all(allKeys.map(async key => {
    return Object.assign({}, { codigo: key }, await hgetall(key))
  }))
  // TODO:
  // por cada ciudad
  //  obtiene datos de ciudad desde forecast.io
  // retorna arreglo con info de ciudades
  send(res, ciudades) // res.end(JSON.stringify(ciudades))
})
router.get('/api/ciudades/:ciudad', async (req, res, params) => {
  if (Math.rand(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    return
  }
  // busca :ciudad en redis
  const ciudad = await hgetall(params.ciudad)
  // TODO:
  // obtiene datos de ciudad en forecast.io
  // retorna datos de ciudad
  send(res, Object.assign({}, { codigo: params.ciudad }, ciudad)) // res.end(JSON.stringify(Object.assign({}, { codigo: params.ciudad }, ciudad)))
})
router.post('/api/ciudades', async (req, res) => {
  if (Math.rand(0, 1) < 0.1) {
    sendError(res, new Error('How unfortunate! The API Request Failed'))
    return
  }
  // agrega datos de ciudad a redis
  const ciudad = await json(req)
  const key = ciudad.codigo
  delete ciudad.codigo
  // guardo el objeto de ciudad
  await hmset(key, Object.entries(ciudad).flat())
  // para busquedas posteriores
  let ciudades = (await get('ciudades')).split() || []
  if (ciudades.indexOf(key) < 0) {
    ciudades.push(key)
    await set('ciudades', ciudades.join())
  }
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

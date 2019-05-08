const http = require('http')
const Router = require('./lib/router')
const { json } = require('./lib/body')
const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient()

const hmset = promisify(client.hmset).bind(client)
const hgetall = promisify(client.hgetall).bind(client)
const set = promisify(client.set).bind(client)
const get = promisify(client.get).bind(client)

const router = new Router()

router.get('/api/ciudades', async (req, res) => {
  // obtiene lista de ciudades desde redis
  // por cada ciudad
  //  obtiene datos de ciudad desde forecast.io
  // retorna arreglo con info de ciudades
  const allKeys = (await get('ciudades')).split(',').filter(key => key !== 'api.errors')
  const ciudades = await Promise.all(allKeys.map(async key => {
    return Object.assign({}, { codigo: key }, await hgetall(key))
  }))
  res.end(JSON.stringify(ciudades))
})
router.get('/api/ciudades/:ciudad', async (req, res, params) => {
  // busca :ciudad en redis
  // obtiene datos de ciudad en forecast.io
  // retorna datos de ciudad
  const ciudad = await hgetall(params.ciudad)
  res.end(JSON.stringify(Object.assign({}, { codigo: params.ciudad }, ciudad)))
})
router.post('/api/ciudades', async (req, res) => {
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
  res.end(JSON.stringify(ciudades))
})

const server = http.createServer()

server.on('request', (req, res) => {
  router.lookup(req, res)
})

server.listen(3000, () => {
  console.log('listeniig on port 3000')
})

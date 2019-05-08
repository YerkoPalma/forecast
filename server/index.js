const http = require('http')
const Router = require('./lib/router')
const { json } = require('./lib/body')

const router = new Router()

router.get('/api/ciudades', (req, res) => {
  // obtiene lista de ciudades desde redis
  // por cada ciudad
  //  obtiene datos de ciudad desde forecast.io
  // retorna arreglo con info de ciudades
  console.log('llamada a /api/ciudades')
  res.end()
})
router.get('/api/ciudades/:ciudad', (req, res, params) => {
  // busca :ciudad en redis
  // obtiene datos de ciudad en forecast.io
  // retorna datos de ciudad
  console.log('llamada a /api/ciudades/' + params.ciudad)
  res.end()
})
router.post('/api/ciudades', async (req, res) => {
  // agrega datos de ciudad a redis
  // const ciudades = await json(req)
  console.log('llamada a POST /api/ciudades')
  res.end()
})

const server = http.createServer()

server.on('request', (req, res) => {
  router.lookup(req, res)
})

server.listen(3000, () => {
  console.log('listeniig on port 3000')
})

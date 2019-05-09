const { promisify } = require('util')

module.exports = class Controller {
  constructor (client) {
    this.client = client

    this.hmset = promisify(client.hmset).bind(client)
    this.hgetall = promisify(client.hgetall).bind(client)
    this.set = promisify(client.set).bind(client)
    this.get = promisify(client.get).bind(client)
  }

  async load (key) {
    return this.hgetall(key)
  }

  async loadAll (key) {
    const allKeys = await this.get(key)
    const values = allKeys ? await Promise.all(allKeys.split(',').map(async key => {
      return Object.assign({}, { codigo: key }, await this.hgetall(key))
    })) : []
    return values
  }

  async save (key, obj) {
    const id = obj.codigo
    delete obj.codigo
    // guardo el objeto de ciudad
    await this.hmset(id, Object.entries(obj).flat())
    // para busquedas posteriores
    let values = await this.get(key)
    if (!values) {
      values = id
      await this.set(key, values)
    } else if (values && values.indexOf(key) < 0) {
      values = values.split(',')
      values.push(id)
      await this.set(key, values.join())
    }
    return values
  }

  async saveAll (key, values) {
    if (!Array.isArray(values)) return null
    return Promise.all(values.map(value => this.save(key, value)))
  }
}

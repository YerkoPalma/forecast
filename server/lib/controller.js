const { promisify } = require('util')

/** Litle controller to manage Redis connections */
class Controller {
  /**
   * Set Redis client and initialize async redis params
   * @param {RedisClient} client Redis client
   */
  constructor (client) {
    this.client = client

    this.hmset = promisify(client.hmset).bind(client)
    this.hgetall = promisify(client.hgetall).bind(client)
    this.set = promisify(client.set).bind(client)
    this.get = promisify(client.get).bind(client)
  }

  /**
   * Loads an object from redis by hash
   * @param {String} key Hash key to lookup
   * @returns {Promise<Object>} The found object, null if not found
   */
  async load (key) {
    return this.hgetall(key)
  }

  /**
   * Get an array of objects from redis by hash
   * @param {String} key Hash key to lookup
   * @returns {Promise<Array>} The found objects, an empty array if nothing found
   */
  async loadAll (key) {
    const allKeys = await this.get(key)
    const values = allKeys ? await Promise.all(allKeys.split(',').map(async key => {
      return Object.assign({}, { codigo: key }, await this.hgetall(key))
    })) : []
    return values
  }

  /**
   * Save an object to redis and save a reference to similar object by object field (`codigo`)
   * @param {String} key Hash key
   * @param {Object} obj Object to save
   * @returns {Promise<Array>} Array of keys from similar objects
   */
  async save (key, obj) {
    const id = obj.codigo
    delete obj.codigo
    await this.hmset(id, Object.entries(obj).flat())
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

  /**
   * Saves a list of objects to redis
   * @param {String} key Has key for the list of objects
   * @param {Array} values Array of objects to save
   * @return {Promise<Array>} Array of keys from similar objects
   */
  async saveAll (key, values) {
    if (!Array.isArray(values)) return null
    return Promise.all(values.map(value => this.save(key, value)))
  }
}

module.exports = Controller

const debug = require('debug')('application:server'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')

const Configuration = require('../config')
const { getRoutes } = require('./Utils')

class Server {
  constructor () {
    this._instance = new Hapi.Server({
      host: Configuration.host,
      port: Configuration.port,
      routes: {
        cors: true
      }
    })
    EventEmitter.call(this)
  }

  getInstance () {
    return this._instance
  }

  async plugins () {
    const swaggerOptions = {
      info: {
        title: 'API Documentation',
        version: Configuration.version
      }
    }
    await this.getInstance().register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ])
  }

  async routes () {
    debug(`Detecting server exposed routes`)
    try {
      const routes = getRoutes()
      if (routes.length === 0) { return true }
      do {
        const route = routes.shift()
        debug(`Route ${route.method} ${route.path} is detected`)
        await this.getInstance().route(route)
      } while (routes.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      await this.plugins()
      await this.routes()
      await this.getInstance().start()
      debug(`Server started`)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(Server, EventEmitter)
module.exports = Server

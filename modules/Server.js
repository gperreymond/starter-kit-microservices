const debug = require('debug')('application:server'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiAuthBasic = require('@hapi/basic')
const colors = require('colors')

const Configuration = require('../config')
const { getRoutes, validateBasic } = require('./Utils')

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
    await this.getInstance().register([Inert, Vision])
    debug(`Plugin Inert, Vision are registered`)
    await this.getInstance().register(HapiAuthBasic)
    this.getInstance().auth.strategy('simple', 'basic', { validate: validateBasic })
    debug(`Plugin HapiAuthBasic is registered`)
    const swaggerOptions = {
      info: {
        title: 'API Documentation',
        version: Configuration.version
      },
      payloadType: 'form',
      securityDefinitions: {
        BasicAuth: { type: 'basic' }
      },
      schemes: ['https'],
      grouping: 'tags'
    }
    await this.getInstance().register({ plugin: HapiSwagger, options: swaggerOptions })
    debug(`Plugin HapiSwagger is registered`)
  }

  async routes () {
    debug(`Detecting server exposed routes`)
    try {
      const routes = getRoutes()
      if (routes.length === 0) { return true }
      do {
        const route = routes.shift()
        let selectedColor = 'green'
        if (!route.options.plugins) { route.options.plugins = {} }
        route.options.plugins['hapi-swagger'] = { security: [] }
        if (route.options.auth === 'simple') {
          selectedColor = 'yellow'
          route.options.plugins['hapi-swagger'].security = [{ BasicAuth: [] }]
        }
        debug(`Route ${colors[selectedColor](route.method)} ${colors[selectedColor](route.path)} is registered with auth: ${colors[selectedColor](route.options.auth)}`)
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

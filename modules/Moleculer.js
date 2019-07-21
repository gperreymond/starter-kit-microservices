const debug = require('debug')('application:moleculer'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')
const { ServiceBroker } = require('moleculer')
const Boom = require('@hapi/boom')

const JoiValidator = require('./JoiValidator')
const Configuration = require('../config')

class Moleculer {
  constructor () {
    debug(`Initializing broker`)
    const self = this
    this._router = []
    this._services = []
    this._instance = new ServiceBroker({
      transporter: {
        type: 'NATS',
        options: {
          url: `nats://${Configuration.nats.hostname}:${Configuration.nats.port}`,
          user: Configuration.nats.username,
          pass: Configuration.nats.password,
          maxReconnectAttempts: 1,
          reconnect: false
        }
      },
      logLevel: {
        CACHER: false,
        TRANSIT: false,
        REGISTRY: false,
        BROKER: 'warn',
        TRANSPORTER: 'error',
        '**': 'info'
      },
      logger: true,
      metrics: true,
      validation: true,
      validator: new JoiValidator(),
      middlewares: [{
        serviceStarted (service) {
          if (service.name === '$node') { return true }
          // ************************
          // Get all actions from a services and do magic stuff based on metadata!
          // ************************
          Object.keys(service.schema.actions).map(key => {
            const metadata = service.schema.actions[key].metadata
            // 1. Route: Call api from hapi
            if (metadata.route) {
              debug(`Action ${service.name}.${key}: Route detected`)
              self._router.push({ action: `${service.name}.${key}`, ...metadata.route })
              self.getInstance().server.route({
                ...metadata.route,
                handler: async function (req, h) {
                  try {
                    const found = self.getRouter().find(item => {
                      if (item.method === req.method && item.path === req.path) { return item }
                    })
                    if (!found) { throw new Error('No action behind this route') }
                    switch (req.method) {
                      case 'get':
                        const a = await self.getInstance().call(found.action, req.query)
                        return a
                      case 'delete':
                        const b = await self.getInstance().call(found.action, req.params)
                        return b
                      default:
                        const c = await self.getInstance().call(found.action, { ...req.payload, ...req.params })
                        return c
                    }
                  } catch (e) {
                    if (e.isBoom) { return e }
                    return Boom.boomify(e, { statusCode: 400 })
                  }
                }
              })
            }
          })
        },
        stopped () {
          this.emit('error', new Error('Moleculer has stopped'))
        },
        started () {
          this.emit('started')
        }
      }]
    })
    EventEmitter.call(this)
  }

  getRouter () {
    return this._router
  }

  getInstance () {
    return this._instance
  }

  async services () {
    debug(`Detecting broker services`)
    try {
      const domains = glob.sync(`${path.resolve(__dirname, '../domains')}/*`)
      do {
        const domain = domains.shift()
        const basename = path.basename(domain)
        debug(`Service ${basename} is detected`)
        this._services.push(domain)
      } while (domains.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      do {
        const service = this._services.shift()
        await this.getInstance().loadService(service)
      } while (this._services.length > 0)
      // Moleculer broker listening...
      await this.getInstance().start()
      debug(`Broker started`)
      // HTTP server listening...
      await this.getInstance().server.start()
      debug(`HTTP Server started`)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(Moleculer, EventEmitter)
module.exports = Moleculer

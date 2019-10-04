const debug = require('debug')('application:broker'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')
const { ServiceBroker } = require('moleculer')

const Configuration = require('../config')
const JoiValidator = require('./JoiValidator')
const Service = require('./Service')

class Broker {
  constructor (type, options) {
    debug(`Initializing broker: ${type}`)
    this._type = type
    this._instance = new ServiceBroker({
      transporter: {
        type,
        options
      },
      logLevel: {
        CACHER: false,
        TRANSIT: false,
        REGISTRY: false,
        BROKER: 'warn',
        TRANSPORTER: 'error',
        '**': 'info'
      },
      logger: Configuration.broker.logger,
      metrics: true,
      validator: new JoiValidator(),
      middlewares: [{
        stopped: () => {
          this.emit('error', new Error('Moleculer has stopped'))
        },
        started: () => {
          this.emit('started')
        }
      }]
    })
    this._instance.$loggers = {}
    EventEmitter.call(this)
  }

  getInstance () {
    return this._instance
  }

  async services () {
    debug('Detecting broker services')
    try {
      const services = glob.sync(`${path.resolve(__dirname, '../services')}/*`)
      if (services.length === 0) { return true }
      do {
        const item = services.shift()
        const basename = path.basename(item)
        debug(`Service ${basename} is detected`)
        const service = new Service(basename)
        this.getInstance().createService(service.getInstance())
      } while (services.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      await this.services()
      await this.getInstance().start()
      debug('Broker started')
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(Broker, EventEmitter)
module.exports = Broker

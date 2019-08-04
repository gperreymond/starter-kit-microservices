const debug = require('debug')('application:broker'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')
const { ServiceBroker } = require('moleculer')

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
      logger: true,
      metrics: true,
      validation: true,
      validator: new JoiValidator(),
      middlewares: [{
        stopped: () => {
          this.emit('error', new Error(`Moleculer has stopped`))
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
    debug(`Detecting broker services`)
    try {
      const domains = glob.sync(`${path.resolve(__dirname, '../domains')}/*`)
      if (domains.length === 0) { return true }
      do {
        const domain = domains.shift()
        const basename = path.basename(domain)
        debug(`Service ${basename} is detected`)
        const service = new Service(basename)
        this.getInstance().createService(service.getInstance())
      } while (domains.length > 0)
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
      debug(`Broker started`)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(Broker, EventEmitter)
module.exports = Broker

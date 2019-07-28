const debug = require('debug')('application:rabbitmq'.padEnd(25, ' '))

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')
const { ServiceBroker } = require('moleculer')

const JoiValidator = require('./JoiValidator')
const Configuration = require('../config')

class RabbitMQ {
  constructor () {
    debug(`Initializing broker`)
    this._instance = new ServiceBroker({
      transporter: {
        type: 'AMQP',
        options: {
          url: `amqp://${Configuration.rabbitmq.username}:${Configuration.rabbitmq.password}@${Configuration.rabbitmq.hostname}:${Configuration.rabbitmq.port}`,
          eventTimeToLive: 5000,
          prefetch: 1,
          // If true, queues will be autodeleted once service is stopped, i.e., queue listener is removed
          autoDeleteQueues: true
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
      stopped: () => {
        this.emit('error', new Error('[RabbitMQ] Moleculer has stopped'))
      },
      started: () => {
        this.emit('started')
      }
    })
    EventEmitter.call(this)
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
      } while (domains.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  async start () {
    try {
      await this.getInstance().start()
      debug(`Broker started`)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }
}

inherits(RabbitMQ, EventEmitter)
module.exports = RabbitMQ

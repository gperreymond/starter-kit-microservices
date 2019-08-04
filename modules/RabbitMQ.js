const debug = require('debug')('application:rabbitmq'.padEnd(25, ' '))

const { Rabbit } = require('rabbit-queue')

const path = require('path')
const glob = require('glob-promise')
const EventEmitter = require('events')
const { inherits } = require('util')

const { getQueues } = require('./Utils')
const Configuration = require('../config')

class RabbitMQ {
  constructor () {
    const options = `amqp://${Configuration.rabbitmq.username}:${Configuration.rabbitmq.password}@${Configuration.rabbitmq.hostname}:${Configuration.rabbitmq.port}`
    this._instance = new Rabbit(options, {
      prefetch: 1, // default prefetch from queue
      replyPattern: false,
      scheduledPublish: false
    })
    this._instance.on('connected', async () => {
      debug('Connected')
      await this.queues()
      this.emit('connected')
    })
    this._instance.on('disconnected', () => {
      this.emit('error', new Error('Rabbitmq Disconnected'))
    })
    EventEmitter.call(this)
  }

  async queues () {
    debug(`Detecting queues`)
    try {
      const domains = glob.sync(`${path.resolve(__dirname, '../domains')}/*`)
      if (domains.length === 0) { return true }
      do {
        const domain = domains.shift()
        const basename = path.basename(domain)
        debug(`Domain ${basename} is detected`)
        const queues = getQueues(`domains/${basename}`)
        if (queues.length > 1) {
          do {
            const queue = queues.shift()
            this.getInstance()
              .createQueue(`${basename}.${queue.name}.Queue`, queue.options, (msg, ack) => {
                console.log(msg.content.toString())
                ack(null, 'response')
              })
              .then(() => console.log('queue created'))
            this.getInstance().bindToExchange(`${basename}.${queue.name}.Queue`, 'amq.topic', `${basename}.${queue.name}.Key`)
            debug(`Queue ${basename}.${queue.name} added`)
          } while (queues.length > 0)
        }
      } while (domains.length > 0)
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  getInstance () {
    return this._instance
  }
}

inherits(RabbitMQ, EventEmitter)
module.exports = RabbitMQ

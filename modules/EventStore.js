const debug = require('debug')('application:eventstore'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const uuid = require('uuid')

const Configuration = require('../config')

class EventStore {
  constructor () {
    this._instance = false
    EventEmitter.call(this)
  }

  async start () {
    debug('Start the eventstore')
    try {
      this._instance = require('rethinkdbdash')({
        servers: [{ host: Configuration.rethinkdb.hostname, port: 28015 }],
        user: Configuration.rethinkdb.username,
        password: Configuration.rethinkdb.password,
        db: 'eventstore',
        silent: true,
        log: (message) => {
          debug(message)
        },
        pool: true,
        cursor: true
      })
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  publish (eventName, data) {
    debug(`Publish data into ${eventName}.Key`)
    if (!this.$rabbitmq) {
      this.emit('error', new Error('RabbitMQ not initialized'))
    } else {
      this.$rabbitmq.publishTopic(`${eventName}.Key`, data)
    }
  }

  async insert (eventName, data) {
    debug(`Insert data from ${eventName}`)
    try {
      const eventId = uuid.v4()
      const { aggregateId } = data
      const [aggregateDomain, aggregateEvent] = eventName.split('.')
      const eventData = {
        aggregateId,
        aggregateDomain,
        aggregateEvent,
        createdAt: new Date(),
        data
      }
      await this._instance.table('events').insert({ id: eventId, ...eventData })
      return true
    } catch (e) {
      console.log(e)
      return Promise.reject(e)
    }
  }

  getInstance () {
    return this
  }
}

inherits(EventStore, EventEmitter)
module.exports = EventStore

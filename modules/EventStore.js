const debug = require('debug')('application:eventstore'.padEnd(25, ' '))

const EventEmitter = require('events')
const { inherits } = require('util')
const uuid = require('uuid')
const couchbase = require('couchbase')

const Configuration = require('../config')

class EventStore {
  constructor () {
    this._instance = false
    EventEmitter.call(this)
  }

  async start () {
    debug('Start the cluster, open the bucket')
    try {
      const cluster = new couchbase.Cluster(`couchbase://${Configuration.couchbase.hostname}/`)
      cluster.authenticate(Configuration.couchbase.username, Configuration.couchbase.password)
      this._instance = cluster.openBucket('eventstore')
      this._instance.on('connect', () => {
        debug('Bucket EventStore is connected')
      })
      this._instance.on('error', (err) => {
        debug('Bucket EventStore error', err.message)
        if (err.code && err.code === 2) {
          this.emit('error', err)
        }
      })
      return true
    } catch (e) {
      this.emit('error', e)
      return Promise.reject(e)
    }
  }

  insert (eventName, data) {
    debug(`Insert data from ${eventName}`)
    return new Promise((resolve, reject) => {
      try {
        const { aggregateId } = data
        const [aggregateType, eventType] = eventName.split('.')
        const rowData = {
          aggregateId: aggregateId,
          aggregateType: aggregateType,
          eventType: eventType,
          createdAt: new Date(),
          data
        }
        const bucket = this._instance
        bucket.manager().createPrimaryIndex(function () {
          bucket.upsert(uuid.v4(), rowData, function (err, result) {
            if (err) { throw err }
            return resolve(true)
          })
        })
      } catch (e) {
        console.log(e)
        return reject(e)
      }
    })
  }

  getInstance () {
    return this
  }
}

inherits(EventStore, EventEmitter)
module.exports = EventStore

const debug = require('debug')('application:logger'.padEnd(25, ' '))

const winston = require('winston')
const Transport = require('winston-transport')
const Logstash = require('logstash-client')

const Configuration = require('../config')

class LogstashTransport extends Transport {
  log (info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })
    logstash.send({
      '@timestamp': new Date(),
      ...info
    }, callback)
  }
}

const logstash = new Logstash({
  type: 'tcp',
  ...Configuration.logstash
})

class Logger {
  constructor (label) {
    debug(`Create new logger: ${label}`)
    this._instance = winston.createLogger({
      format: winston.format.combine(
        winston.format.label({ label }),
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new LogstashTransport()
      ]
    })
  }

  getInstance () {
    return this._instance
  }
}

module.exports = Logger

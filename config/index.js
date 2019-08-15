const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf.json' })

// ************************************
// Typecasting from kube env
// ************************************
let APP_PORT = 3000
let APP_RABBITMQ_PORT = 5672
let APP_NATS_PORT = 4222
let APP_LOGSTASH_PORT = 5000
// ************************************
if (nconf.get('APP_PORT')) { APP_PORT = parseInt(nconf.get('APP_PORT')) }
if (nconf.get('APP_RABBITMQ_PORT')) { APP_RABBITMQ_PORT = parseInt(nconf.get('APP_RABBITMQ_PORT')) }
if (nconf.get('APP_NATS_PORT')) { APP_NATS_PORT = parseInt(nconf.get('APP_NATS_PORT')) }
if (nconf.get('APP_LOGSTASH_PORT')) { APP_LOGSTASH_PORT = parseInt(nconf.get('APP_LOGSTASH_PORT')) }
// ************************************

module.exports = {
  env: process.env.NODE_ENV || 'development',
  name: require('../package.json').name,
  version: require('../package.json').version,
  commit: `${require('../package.json').homepage || ''}/commit/${nconf.get('APP_LAST_COMMIT') || 'localhost'}`,
  host: nconf.get('APP_HOST') || '0.0.0.0',
  port: APP_PORT,
  logstash: {
    host: nconf.get('APP_LOGSTASH_HOST') || 'localhost',
    port: APP_LOGSTASH_PORT
  },
  rabbitmq: {
    hostname: nconf.get('APP_RABBITMQ_HOSTNAME') || 'localhost',
    port: APP_RABBITMQ_PORT,
    username: nconf.get('APP_RABBITMQ_USERNAME') || 'infra',
    password: nconf.get('APP_RABBITMQ_PASSWORD') || 'infra'
  },
  nats: {
    hostname: nconf.get('APP_NATS_HOSTNAME') || 'localhost',
    port: APP_NATS_PORT,
    username: nconf.get('APP_NATS_USERNAME') || 'infra',
    password: nconf.get('APP_NATS_PASSWORD') || 'infra',
    maxReconnectAttempts: 3
  },
  auth: {
    basic: {
      username: nconf.get('APP_AUTH_BASIC_USERNAME') || 'infra',
      password: nconf.get('APP_AUTH_BASIC_PASSWORD') || 'infra'
    }
  },
  api: {
    google_books_url: 'https://www.googleapis.com/books/v1/volumes'
  }
}

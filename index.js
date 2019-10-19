const debug = require('debug')('application:main'.padEnd(25, ' '))

const Moleculer = require('./modules/Moleculer')
const Server = require('./modules/Server')
const RabbitMQ = require('./modules/RabbitMQ')
const EventStore = require('./modules/EventStore')

const Configuration = require('./config')

debug(`Starting application: ${Configuration.env}`)

const captureException = function (err) {
  debug('Something went wrong', err.name)
  console.log(err)
  setTimeout(() => {
    process.exit(1)
  }, 250)
}
process.on('uncaughtException', captureException)
process.on('exit', (n) => {
  if (n !== 0) { captureException(new Error('Node process has exit...')) }
})

/*****
NATS
*****/
const NATS = {
  url: `nats://${Configuration.nats.hostname}:${Configuration.nats.port}`,
  user: Configuration.nats.username,
  pass: Configuration.nats.password,
  maxReconnectAttempts: 1,
  reconnect: false
}

const start = async function () {
  try {
    // Eventstore
    const eventstore = new EventStore()
    await eventstore.start()
    eventstore.on('error', err => { throw err })
    // RabbitMQ (Messages)
    const rabbitmq = new RabbitMQ()
    rabbitmq.on('error', err => { throw err })
    // Moleculer on nats (Services)
    const moleculer = new Moleculer('NATS', NATS)
    moleculer.on('error', err => { throw err })
    moleculer.getInstance().$eventstore = eventstore.getInstance()
    moleculer.getInstance().$rabbitmq = rabbitmq.getInstance()
    await moleculer.start()
    rabbitmq.$moleculer = moleculer.getInstance()
    // Server (Gateway)
    const server = new Server()
    server.getInstance().decorate('request', 'moleculer', moleculer.getInstance())
    server.getInstance().decorate('request', 'rabbitmq', rabbitmq.getInstance())
    server.on('error', err => { throw err })
    await server.start()
    debug('Application started')
  } catch (e) {
    console.log('******************** ERROR')
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})

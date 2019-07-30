const debug = require('debug')('application:main'.padEnd(25, ' '))

const Broker = require('./modules/Broker')
const Server = require('./modules/Server')
const Configuration = require('./config')

debug(`Starting application: ${Configuration.env}`)

const captureException = function (err) {
  debug('Something went wrong')
  console.log(err)
  setTimeout(() => {
    process.exit(1)
  }, 250)
}
process.on('uncaughtException', captureException)
process.on('exit', (n) => {
  if (n !== 0) { captureException(new Error(`Node process has exit...`)) }
})

const NATS = {
  url: `nats://${Configuration.nats.hostname}:${Configuration.nats.port}`,
  user: Configuration.nats.username,
  pass: Configuration.nats.password,
  maxReconnectAttempts: 1,
  reconnect: false
}
const RABBITMQ = {
  url: `amqp://${Configuration.rabbitmq.username}:${Configuration.rabbitmq.password}@${Configuration.rabbitmq.hostname}:${Configuration.rabbitmq.port}`,
  eventTimeToLive: 5000,
  prefetch: 1,
  // If true, queues will be autodeleted once service is stopped, i.e., queue listener is removed
  autoDeleteQueues: true
}

const start = async function () {
  try {
    // Moleculer on nats (services discovery)
    const nats = new Broker('NATS', NATS)
    nats.on('error', err => { throw err })
    await nats.start()
    debug(`Nats started`)
    // Moleculer on rabbitmq
    const rabbitmq = new Broker('AMQP', RABBITMQ)
    rabbitmq.on('error', err => { throw err })
    await rabbitmq.start()
    debug(`RabbitMQ started`)
    // All good
    debug(`Application started`)
  } catch (e) {
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})

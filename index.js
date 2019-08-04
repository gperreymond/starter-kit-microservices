const debug = require('debug')('application:main'.padEnd(25, ' '))

const couchbase = require('couchbase')
const cluster = new couchbase.Cluster('couchbase://172.30.0.10')
cluster.authenticate('infra', 'azer1234')

const Broker = require('./modules/Broker')
const Server = require('./modules/Server')
const RabbitMQ = require('./modules/RabbitMQ')
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

const start = async function () {
  try {
    // Moleculer on nats (services discovery)
    const nats = new Broker('NATS', NATS)
    nats.on('error', err => { throw err })
    nats.getInstance().$books = cluster.openBucket('books')
    await nats.start()
    debug(`Nats started`)
    // RabbitMQ queues
    const rabbitmq = new RabbitMQ()
    rabbitmq.on('error', err => { throw err })
    // Server
    const server = new Server()
    server.getInstance().decorate('request', 'nats', nats.getInstance())
    server.getInstance().decorate('request', 'rabbitmq', rabbitmq.getInstance())
    server.on('error', err => { throw err })
    await server.start()
    // All good
    nats.$rabbitmq = rabbitmq
    debug(`Application started`)
  } catch (e) {
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})

const debug = require('debug')('application:main'.padEnd(25, ' '))
// const couchbase = require('couchbase')

const Broker = require('./modules/Broker')
const Server = require('./modules/Server')
const RabbitMQ = require('./modules/RabbitMQ')
const Models = require('./modules/Models')

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
  if (n !== 0) { captureException(new Error('Node process has exit...')) }
})

/*****
COUCHBASE
*****/
/* let cluster
let eventstore
try {
  cluster = new couchbase.Cluster(`couchbase://${Configuration.couchbase.hostname}/`)
  cluster.authenticate(Configuration.couchbase.username, Configuration.couchbase.password)
  eventstore = cluster.openBucket('eventstore')
} catch (e) {
  captureException(e)
} */

let eventstore
try {
  eventstore = require('rethinkdbdash')({
    servers: [{ host: Configuration.rethinkdb.hostname, port: 28015 }],
    discovery: true,
    user: Configuration.rethinkdb.username,
    password: Configuration.rethinkdb.password,
    db: 'eventstore',
    silent: true,
    log: (message) => {
      // console.log(message)
    }
  })
  eventstore.getPoolMaster().on('healthy', function (healthy) {
    if (healthy === false) {
      captureException('Rethinkdb is unhealthy')
    }
  })
} catch (e) {
  captureException(e)
}

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
    // Data models connections
    const models = new Models()
    await models.start()
    // RabbitMQ queues
    const rabbitmq = new RabbitMQ()
    rabbitmq.on('error', err => { throw err })
    // Moleculer on nats (services discovery)
    const moleculer = new Broker('NATS', NATS)
    moleculer.on('error', err => { throw err })
    moleculer.getInstance().$models = models.getInstance()
    moleculer.getInstance().$eventstore = eventstore
    moleculer.getInstance().$rabbitmq = rabbitmq.getInstance()
    await moleculer.start()
    rabbitmq.$moleculer = moleculer.getInstance()
    debug('Moleculer started')
    // Server
    const server = new Server()
    server.getInstance().decorate('request', 'moleculer', moleculer.getInstance())
    server.getInstance().decorate('request', 'rabbitmq', rabbitmq.getInstance())
    server.on('error', err => { throw err })
    await server.start()
    debug('Application started')
  } catch (e) {
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})

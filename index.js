const debug = require('debug')('application:main'.padEnd(25, ' '))

const Nats = require('./modules/Nats')
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

const start = async function () {
  try {
    // Moleculer on nats (services discovery)
    const nats = new Nats()
    nats.on('error', err => { throw err })
    await nats.start()
    debug(`Nats started`)
    // Nats on rabbitmq
    const rabbitmq = new RabbitMQ()
    rabbitmq.on('error', err => { throw err })
    await rabbitmq.start()
    debug(`RabbitMQ started`)
    // Cross attachments
    nats.$rabbitmq = rabbitmq
    rabbitmq.$nats = nats
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

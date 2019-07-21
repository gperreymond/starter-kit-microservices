const debug = require('debug')('application:main'.padEnd(25, ' '))

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
    const Moleculer = require('./modules/Moleculer')
    const moleculer = new Moleculer()
    moleculer.on('error', err => { throw err })
    // Load service internal
    await moleculer.getInstance().loadService('./services/Internal')
    // Load other services in "domains"
    await moleculer.services()
    await moleculer.start()
    debug(`Application started`)
  } catch (e) {
    return Promise.reject(e)
  }
}

start().catch(err => {
  console.log(err)
  process.exit(1)
})

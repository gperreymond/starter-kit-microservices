const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf.json' })

let APP_CUSTOMERS_PORT = 5432
if (nconf.get('APP_CUSTOMERS_PORT')) { APP_CUSTOMERS_PORT = parseInt(nconf.get('APP_CUSTOMERS_PORT')) }

module.exports = {
  dialect: 'postgres',
  database: nconf.get('APP_CUSTOMERS_DATABASE') || 'infra',
  hostname: nconf.get('APP_CUSTOMERS_HOSTNAME') || 'localhost',
  port: APP_CUSTOMERS_PORT,
  username: nconf.get('APP_CUSTOMERS_USERNAME') || 'infra',
  password: nconf.get('APP_CUSTOMERS_PASSWORD') || 'infra'
}

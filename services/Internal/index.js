const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('../../modules/Utils')
const Server = require('../../modules/Server')

debug('Internal is detected')

module.exports = {
  name: 'Internal',
  actions: getActions('services/Internal'),
  events: {},
  methods: {},
  created () {
    debug(`${this.name} is created`)
    // Attach http server to moleculer
    const server = new Server()
    this.broker.server = server.getInstance()
  },
  async started () {
    debug(`${this.name} is started`)
  },
  async stopped () {
    debug(`${this.name} is stopped`)
  }
}

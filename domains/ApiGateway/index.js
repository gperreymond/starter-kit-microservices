const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('../../modules/Utils')

module.exports = {
  name: 'ApiGateway',
  actions: getActions('domains/ApiGateway'),
  events: {},
  methods: {},
  created () {
    debug(`${this.name} is created`)
  },
  async started () {
    debug(`${this.name} is started`)
  },
  async stopped () {
    debug(`${this.name} is started`)
  }
}

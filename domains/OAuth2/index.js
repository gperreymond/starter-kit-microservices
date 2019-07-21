const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('../../modules/Utils')

module.exports = {
  name: 'OAuth2',
  actions: getActions('domains/OAuth2'),
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

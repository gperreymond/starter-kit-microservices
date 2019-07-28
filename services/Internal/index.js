const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('../../modules/Utils')

debug('Internal is detected')

module.exports = {
  name: 'Internal',
  actions: getActions('services/Internal'),
  events: {},
  methods: {},
  created () {
    debug(`${this.name} is created`)
  },
  async started () {
    debug(`${this.name} is started`)
  },
  async stopped () {
    debug(`${this.name} is stopped`)
  }
}

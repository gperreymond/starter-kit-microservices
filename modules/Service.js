const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('./Utils')

class Service {
  constructor (name, broker) {
    const actions = getActions(`domains/${name}`, broker)
    this._name = name
    this._instance = {
      name,
      actions,
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
  }

  getInstance () {
    return this._instance
  }
}

module.exports = Service

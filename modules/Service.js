const { getActions } = require('./Utils')

class Service {
  constructor (name) {
    const actions = getActions(`services/${name}`)
    // const events = require(`../services/${name}/events.js`)
    this._name = name
    this._instance = {
      name,
      actions,
      // events,
      methods: {},
      created () {
      },
      async started () {
      },
      async stopped () {
      }
    }
  }

  getInstance () {
    return this._instance
  }
}

module.exports = Service

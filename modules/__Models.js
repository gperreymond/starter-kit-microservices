const debug = require('debug')('application:models'.padEnd(25, ' '))

const Sequelize = require('sequelize')
const EventEmitter = require('events')
const { inherits } = require('util')

const { getDataModels } = require('./Utils')

class Models {
  constructor () {
    debug('Initializing Models')
    this._instance = {}
    EventEmitter.call(this)
  }

  async start () {
    try {
      const models = getDataModels('models')
      if (models.length === 0) { return true }
      do {
        const model = models.shift()
        debug(`${model.name} is registered`)
        const sequelize = new Sequelize(model.connect.database, model.connect.username, model.connect.password, {
          host: model.connect.hostname,
          dialect: model.connect.dialect,
          logging: () => {}
        })
        await sequelize.authenticate()
        this._instance[model.name] = sequelize.define(model.name, model.attributes, model.options)
        await this._instance[model.name].sync()
      } while (models.length > 0)
      return true
    } catch (e) {
      return Promise.reject(e)
    }
  }

  getInstance () {
    return this._instance
  }
}

inherits(Models, EventEmitter)
module.exports = Models

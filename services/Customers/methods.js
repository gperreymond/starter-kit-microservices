const Sequelize = require('sequelize')

const methods = {
  async createModels () {
    try {
      const ctx = this.currentContext
      if (!this.$customers) {
        ctx.broker.logger.warn(ctx.action.name, 'create models for the domain Customers')
        // Models
        const customers = require('./models/customers')
        // Database connection
        const sequelize = new Sequelize(customers.connect.database, customers.connect.username, customers.connect.password, {
          host: customers.connect.hostname,
          dialect: customers.connect.dialect,
          logging: () => {}
        })
        await sequelize.authenticate()
        // Affect to the service
        this.$customers = sequelize.define(customers.name, customers.attributes, customers.options)
      }
      await this.$customers.sync()
      return true
    } catch (e) {
      const ctx = this.currentContext
      ctx.broker.logger.error(ctx.action.name, e.message)
      return Promise.reject(e)
    }
  }
}

module.exports = methods

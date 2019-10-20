const uuid = require('uuid')

const handler = async function (ctx) {
  ctx.broker.logger.warn(ctx.action.name, ctx.params)
  try {
    await this.createModels()
    const aggregateId = uuid.v4()
    // Insert into Database
    await this.$customers.create({
      id: aggregateId,
      ...ctx.params
    })
    // Insert into Eventstore
    ctx.broker.emit('Customers.CustomerCreatedEvent', {
      aggregateId,
      ...ctx.params
    })
    return true
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

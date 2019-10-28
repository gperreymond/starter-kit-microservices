const uuid = require('uuid')

const handler = async function (ctx) {
  ctx.broker.logger.warn(ctx.action.name, ctx.params)
  try {
    await this.createModels() // Create models for the service if not exists
    const aggregateId = uuid.v4()
    // Insert into Database
    await this.$customers.create({
      id: aggregateId,
      ...ctx.params
    })
    // Make event
    const event = {
      name: 'Customers.CustomerCreatedEvent',
      data: {
        aggregateId,
        ...ctx.params
      }
    }
    // Event emit into Moleculer
    await ctx.broker.emit(event.name, event.data)
    // Event publish into Eventstore
    ctx.broker.$eventstore.publish(event.name, event.data)
    return true
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

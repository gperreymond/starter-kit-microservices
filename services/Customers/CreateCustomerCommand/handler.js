const handler = async (ctx) => {
  ctx.broker.logger.warn(ctx.action.name, ctx.params)
  try {
    ctx.broker.emit('Customers.CustomerCreatedEvent', ctx.params)
    return {}
  } catch (e) {
    ctx.broker.logger.error(ctx.action.name, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

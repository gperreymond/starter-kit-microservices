const handler = async function (ctx) {
  try {
    ctx.broker.logger.warn(ctx.eventName, ctx.params)
    return true
  } catch (e) {
    ctx.broker.logger.error(ctx.eventName, e.message)
    return false
  }
}

module.exports = handler

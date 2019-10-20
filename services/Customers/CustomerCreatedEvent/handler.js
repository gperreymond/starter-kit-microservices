const handler = async function (ctx) {
  ctx.broker.logger.warn(ctx.eventName, ctx.params)
  try {
    await ctx.broker.$eventstore.insert(ctx.eventName, ctx.params)
    return true
  } catch (e) {
    ctx.broker.logger.error(ctx.eventName, e.message)
    return false
  }
}

module.exports = handler

const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.ctx.eventName, ctx.params)
}

module.exports = handler

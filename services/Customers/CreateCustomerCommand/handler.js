const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    await ctx.broker.$models.PolagramUser.create(ctx.params)
  } catch (e) {
    ctx.service.logger.error(ctx.action.rawName, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

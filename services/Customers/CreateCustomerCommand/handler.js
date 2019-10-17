const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    const { email } = ctx.params
    return { email }
  } catch (e) {
    ctx.service.logger.error(ctx.action.rawName, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

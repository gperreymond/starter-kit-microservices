const Configuration = require('../../../config')

const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    const { env, name, version, commit } = Configuration
    return {
      env,
      name,
      version,
      commit
    }
  } catch (e) {
    ctx.service.logger.error(ctx.action.rawName, e.message)
    return Promise.reject(e)
  }
}

module.exports = handler

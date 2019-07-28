const Configuration = require('../../../config')

const handler = async (ctx) => {
  try {
    const services = []
    const actions = await ctx.broker.call('$node.actions')
    actions.map(action => {
      if (action.name.search(/node/) === -1) { services.push(action.name) }
    })
    return {
      env: Configuration.env,
      name: Configuration.name,
      version: Configuration.version,
      commit: Configuration.commit,
      services
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

module.exports = handler

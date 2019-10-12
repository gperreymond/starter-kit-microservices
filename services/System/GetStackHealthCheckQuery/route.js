const Boom = require('@hapi/boom')

const Configuration = require('../../../config')

const handler = async (req) => {
  try {
    const { env, name, version, commit } = Configuration
    return {
      env,
      name,
      version,
      commit
    }
  } catch (e) {
    return Boom.boomify(e, { statusCode: 400 })
  }
}

module.exports = {
  method: 'get',
  path: '/hc',
  handler,
  options: {
    auth: false,
    log: { collect: false },
    tags: ['api', 'System']
  }
}

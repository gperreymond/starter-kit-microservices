const Boom = require('@hapi/boom')

const handler = async (req) => {
  try {
    const result = await req.nats.call('System.GetHealthCheckForKubernetes')
    return result
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
    log: { collect: true },
    tags: ['api', 'System']
  }
}

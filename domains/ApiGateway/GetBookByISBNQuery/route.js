const { params } = require('./validate')

const handler = async (req) => {
  try {
    const result = await req.nats.call('ApiGateway.GetBookByISBNQuery', req.params)
    return result
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  method: 'get',
  path: '/api/v1/books/{isbn}',
  handler,
  options: {
    validate: {
      params
    },
    auth: false,
    log: { collect: true }
  }
}

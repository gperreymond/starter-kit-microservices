const { query } = require('./validate')

const handler = async (req) => {
  try {
    const result = await req.nats.call('Books.BnFApiPerformSearchByISBNQuery', req.query)
    return result
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  method: 'get',
  path: '/api/v1/bnf/books',
  handler,
  options: {
    validate: {
      query
    },
    auth: false,
    log: { collect: true }
  }
}

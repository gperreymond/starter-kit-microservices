const { query } = require('./validate')

const handler = async (req) => {
  try {
    const result = await req.nats.call('Books.GoogleBooksApiPerformSearchByISBNQuery', req.query)
    return result
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  method: 'get',
  path: '/api/v1/books',
  handler,
  options: {
    validate: {
      query
    },
    auth: false,
    log: { collect: true }
  }
}

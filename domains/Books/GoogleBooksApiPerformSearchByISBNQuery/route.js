const { query } = require('./params')

module.exports = {
  method: 'get',
  path: '/api/v1/books/',
  options: {
    validate: {
      query
    },
    auth: false,
    log: { collect: true }
  }
}

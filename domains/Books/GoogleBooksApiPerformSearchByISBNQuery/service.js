const axios = require('axios')

const Configuration = require('../../../config')
const { params } = require('./validate')

const handler = async (ctx) => {
  try {
    const { isbn } = ctx.params
    const URL = `${Configuration.google.api.books.url}?q=isbn:${isbn}&key=${Configuration.google.api.books.key}`
    const { data } = await axios.get(URL)
    if (data.totalItems === 0) { throw new Error('Book not found') }
    return data.items[0]
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}

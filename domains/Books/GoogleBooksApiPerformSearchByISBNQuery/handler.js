const axios = require('axios')

const Configuration = require('../../../config')

const handler = async (ctx) => {
  try {
    const { isbn } = ctx.params
    const URL = `${Configuration.google.api.books.url}?q=${isbn}&key=${Configuration.google.api.books.key}`
    const { data } = await axios.get(URL)
    return data
  } catch (e) { return Promise.reject(e) }
}

module.exports = handler

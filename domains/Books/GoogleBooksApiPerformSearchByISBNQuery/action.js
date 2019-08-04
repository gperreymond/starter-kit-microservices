const axios = require('axios')
const { errors } = require('couchbase')

const Configuration = require('../../../config')
const { params } = require('./validate')

const upsert = (bucket, isbn, data) => {
  return new Promise((resolve, reject) => {
    bucket.mutateIn(isbn).upsert('GOOGLE', data).execute((err, result) => {
      if (err) {
        if (err.code && err.code === errors.keyNotFound) {
          bucket.insert(isbn, { OPEN_LIBRARY: data }, (err, result) => {
            if (err) { return reject(err) }
            return resolve()
          })
        }
        return reject(err)
      }
      return resolve()
    })
  })
}

const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    const { isbn } = ctx.params
    const URL = `${Configuration.google.api.books.url}?q=isbn:${isbn}&key=${Configuration.google.api.books.key}`
    const { data } = await axios.get(URL)
    // get ISBN_13
    if (data.totalItems === 1) {
      const infos = data.items[0].volumeInfo
      let ISBN_13 = false
      infos.industryIdentifiers.map(item => { if (item.type === 'ISBN_13') ISBN_13 = item.identifier })
      if (ISBN_13 !== false) {
        ctx.service.logger.warn(ctx.action.rawName, 'upsert', ISBN_13)
        await upsert(ctx.broker.$books, ISBN_13, infos).catch(err => {
          ctx.service.logger.error(err.message)
        })
      }
    }
    return true
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}

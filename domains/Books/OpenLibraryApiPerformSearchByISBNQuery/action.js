const axios = require('axios')
const { errors } = require('couchbase')

const Configuration = require('../../../config')
const { params } = require('./validate')

const upsert = (bucket, isbn, data) => {
  return new Promise((resolve, reject) => {
    bucket.mutateIn(isbn).upsert('OPEN_LIBRARY', data).execute((err, result) => {
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
    const URL = `${Configuration.openlibrary.api.books.url}?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
    const { data } = await axios.get(URL)
    // get ISBN_13
    if (data[`ISBN:${isbn}`]) {
      const infos = data[`ISBN:${isbn}`]
      do {
        const ISBN_13 = infos.identifiers.isbn_13.shift()
        ctx.service.logger.warn(ctx.action.rawName, 'upsert', ISBN_13)
        await upsert(ctx.broker.$books, ISBN_13, infos).catch(err => {
          ctx.service.logger.error(err.message)
        })
      } while (infos.identifiers.isbn_13.length > 0)
    }
    return true
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}

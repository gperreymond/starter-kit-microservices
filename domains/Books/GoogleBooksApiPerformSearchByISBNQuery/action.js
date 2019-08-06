const axios = require('axios')
const { errors } = require('couchbase')

const Configuration = require('../../../config')
const { params } = require('./validate')

const upsert = (bucket, isbn, data) => {
  return new Promise((resolve, reject) => {
    bucket.mutateIn(isbn).upsert('GOOGLE', data).execute((err, result) => {
      if (err) {
        if (err.code && err.code === errors.keyNotFound) {
          bucket.insert(isbn, { GOOGLE: data }, (err, result) => {
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
    const skip = ctx.params.skip || 0
    const URL = `${Configuration.api.google_books_url}?q=${isbn}&startIndex=${skip}&maxResults=40&printTypes=books`
    console.log(URL)
    const { data } = await axios.get(URL)
    // get ISBN_13
    if (data.totalItems > 0 && data.items) {
      do {
        const entry = data.items.shift()
        const infos = entry.volumeInfo
        let ISBN_13 = false
        if (infos.industryIdentifiers) {
          infos.industryIdentifiers.map(item => { if (item.type === 'ISBN_13') ISBN_13 = item.identifier })
          if (ISBN_13 !== false) {
            ctx.service.logger.warn(ctx.action.rawName, 'upsert', ISBN_13)
            await upsert(ctx.broker.$books, ISBN_13, entry).catch(err => {
              ctx.service.logger.error(err.message)
            })
          }
        }
      } while (data.items.length > 0)
    }
    // requeue next ?
    console.log(skip + 40, data.totalItems)
    if (skip + 40 < data.totalItems) {
      ctx.broker.$rabbitmq.publishTopic('Books.GoogleBooksApiPerformSearchByISBNQuery.Key', { isbn, skip: (skip + 40) }, { correlationId: '1' })
    }
    return true
  } catch (e) { return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}

const Boom = require('@hapi/boom')
const { errors } = require('couchbase')

const { params } = require('./validate')

const get = (bucket, isbn) => {
  return new Promise((resolve, reject) => {
    bucket.get(isbn, (err, result) => {
      if (err) {
        if (err.code && err.code === errors.keyNotFound) {
          return reject(Boom.notFound('Document not found'))
        }
        return reject(err)
      }
      return resolve(result)
    })
  })
}

const handler = async (ctx) => {
  ctx.service.logger.warn(ctx.action.rawName, ctx.params)
  try {
    const { isbn } = ctx.params
    // couchbase ready ?
    if (ctx.broker.$books.connected === false) { throw new Error('Bucket books deconnected!') }
    // try to get book
    const book = await get(ctx.broker.$books, isbn).catch((err) => {
      // book not found ?
      if (err.isBoom) {
        ctx.broker.emit('Books.PerformSearchByISBNEvent', { isbn, OPEN_LIBRARY: true, BNF: true, GOOGLE: true })
        return Promise.reject(Boom.notFound('Document not found'))
      }
      throw err
    })
    ctx.broker.emit('Books.PerformSearchByISBNEvent', { isbn, OPEN_LIBRARY: !book.OPEN_LIBRARY, BNF: !book.BNF, GOOGLE: !book.GOOGLE })
    return book
  } catch (e) { console.log(e.message); return Promise.reject(e) }
}

module.exports = {
  params,
  handler
}

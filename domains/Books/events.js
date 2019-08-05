module.exports = {
  'Books.PerformSearchByISBNEvent' (payload) {
    this.broker.logger.warn('Books.PerformSearchByISBNEvent', payload)
    console.log(this.broker.$rabbitmq)
    /* this.broker.call('Books.OpenLibraryApiPerformSearchByISBNQuery', { isbn: payload.isbn }).catch((err) => {
      this.broker.logger.error('Books.OpenLibraryApiPerformSearchByISBNQuery', err.message)
    })
    this.broker.call('Books.GoogleBooksApiPerformSearchByISBNQuery', { isbn: payload.isbn }).catch((err) => {
      this.broker.logger.error('Books.GoogleBooksApiPerformSearchByISBNQuery', err.message)
    })
    this.broker.call('Books.BnFApiPerformSearchByISBNQuery', { isbn: payload.isbn }).catch((err) => {
      this.broker.logger.error('Books.BnFApiPerformSearchByISBNQuery', err.message)
    }) */
    // if (payload.BNF === true) { this.broker.call('Books.BnFApiPerformSearchByISBNQuery', payload).catch((err) => { this.broker.logger.error('Books.PerformSearchByISBNEvent', err.message) }) }
    // if (payload.GOOGLE === true) { this.broker.call('Books.GoogleBooksApiPerformSearchByISBNQuery', payload).catch((err) => { this.broker.logger.error('Books.PerformSearchByISBNEvent', err.message) }) }
    // if (payload.OPEN_LIBRARY === true) { this.broker.call('Books.OpenLibraryApiPerformSearchByISBNQuery', payload).catch((err) => { this.broker.logger.error('Books.PerformSearchByISBNEvent', err.message) }) }
  }
}

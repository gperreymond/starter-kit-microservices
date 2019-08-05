module.exports = {
  'Books.PerformSearchByISBNEvent' (payload) {
    this.broker.logger.warn('Books.PerformSearchByISBNEvent', payload)
    this.broker.$rabbitmq.publishTopic('Books.GoogleBooksApiPerformSearchByISBNQuery.Key', { isbn: payload.isbn }, { correlationId: '1' })
  }
}

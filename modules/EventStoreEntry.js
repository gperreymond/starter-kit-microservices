const uuid = require('uuid')

class EventStoreEntry {
  constructor (params) {
    const { data } = params
    this.id = uuid.v4()
    // global
    this.createdAt = new Date()
    // data
    this.data = data
  }
}

module.exports = EventStoreEntry

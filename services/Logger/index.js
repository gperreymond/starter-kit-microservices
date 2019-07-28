const debug = require('debug')('application:services'.padEnd(25, ' '))

const { getActions } = require('../../modules/Utils')

module.exports = {
  name: 'Logger',
  actions: getActions('domains/Logger'),
  events: {
    'metrics.trace.span.finish': async function (event) {
      // No log system
      if (event.service.name === '$node') { return true }
      const actions = await this.broker.call('$node.actions')
      const found = actions.find(item => {
        return item.name === event.action.name
      })
      // No log if metrics false
      if (found.action.metadata && found.action.metadata.metrics === false) { return true }
      // Date as datetime
      event.startTime = new Date(event.startTime)
      event.endTime = new Date(event.endTime)
      if (event.error) {
        // Write log as error
        this.broker.logger.error(event)
      } else {
        // Write los as info
        this.broker.logger.warn(event)
      }
      return true
    }
  },
  methods: {},
  created () {
    debug(`${this.name} is created`)
  },
  async started () {
    debug(`${this.name} is started`)
  },
  async stopped () {
    debug(`${this.name} is started`)
  }
}

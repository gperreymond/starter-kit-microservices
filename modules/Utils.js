const path = require('path')
const glob = require('glob-promise')

const getQueues = (dirpath) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/queue.js`)
  const queues = []
  if (files.length === 0) { return queues }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const options = require(file)
    queues.push({
      name: basename,
      options
    })
  } while (files.length)
  return queues
}

const getActions = (dirpath) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/action.js`)
  const actions = {}
  if (files.length === 0) { return actions }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const action = require(file)
    actions[basename] = action
  } while (files.length)
  return actions
}

const getEvents = (dirpath) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/event.js`)
  const events = {}
  if (files.length === 0) { return events }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const event = require(file)
    events[basename] = event
  } while (files.length)
  return events
}

const getRoutes = () => {
  const files = glob.sync(path.resolve(__dirname, '../', 'domains/**/route.js'))
  const routes = []
  if (files.length === 0) { return routes }
  do {
    const file = files.shift()
    const route = require(file)
    routes.push(route)
  } while (files.length)
  return routes
}

module.exports = {
  getQueues,
  getActions,
  getEvents,
  getRoutes
}

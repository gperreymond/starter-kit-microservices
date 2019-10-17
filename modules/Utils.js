const path = require('path')
const glob = require('glob-promise')
const fse = require('fs-extra')
const debug = require('debug')('application:utils'.padEnd(25, ' '))

const Configuration = require('../config')

const validateBasic = async (request, username, password) => {
  const basic = Configuration.auth.basic
  if (!basic) {
    return { isValid: false }
  }
  const isValid = (username === basic.username && password === basic.password)
  return { isValid, credentials: { name: basic.username } }
}

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
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/handler.js`)
  const actions = {}
  if (files.length === 0) { return actions }
  do {
    const file = files.shift()
    const basename = path.basename(path.resolve(file, '..'))
    const basepath = path.resolve(file, '..')
    const action = {
      handler: require(`${basepath}/handler.js`)
    }
    if (fse.pathExistsSync(`${basepath}/params.js`)) { action.params = require(`${basepath}/params.js`) }
    debug(`Action ${basename} has been found`)
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
    const basepath = path.resolve(file, '..')
    const event = {
      handler: require(`${basepath}/event.js`)
    }
    debug(`Event ${basename} has been found`)
    events[basename] = event
  } while (files.length)
  return events
}

const getRoutes = () => {
  const files = glob.sync(path.resolve(__dirname, '../', 'services/**/route.js'))
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
  getRoutes,
  validateBasic
}

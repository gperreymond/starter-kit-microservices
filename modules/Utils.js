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
  getRoutes,
  validateBasic
}

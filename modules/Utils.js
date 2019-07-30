const path = require('path')
const glob = require('glob-promise')

const getActions = (dirpath) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/service.js`)
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
  getActions,
  getRoutes
}

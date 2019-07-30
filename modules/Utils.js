const path = require('path')
const glob = require('glob-promise')

const getActions = (dirpath, broker) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*/index.js`)
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

module.exports = {
  getActions
}

const path = require('path')
const glob = require('glob-promise')

const getActions = (dirpath) => {
  const files = glob.sync(`${path.resolve(__dirname, '../', dirpath)}/*`)
  const actions = {}
  do {
    const file = files.shift()
    const basename = path.basename(file)
    if (basename !== 'index.js') {
      actions[basename] = require(file)
    }
  } while (files.length)
  return actions
}

module.exports = {
  getActions
}

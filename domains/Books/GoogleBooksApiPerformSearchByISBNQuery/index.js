const { params } = require('./validate')

module.exports = {
  params,
  handler: require('./handler')
}

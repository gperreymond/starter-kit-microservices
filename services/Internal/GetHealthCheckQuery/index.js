module.exports = {
  metadata: {
    route: require('./route.json'),
    metrics: true
  },
  params: require('./params'),
  handler: require('./handler')
}

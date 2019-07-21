module.exports = {
  metadata: {
    route: require('./route.json'),
    metrics: true
  },
  metrics: {
    params: false,
    meta: false
  },
  params: require('./params'),
  handler: require('./handler')
}

module.exports = {
  metadata: {
    metrics: true,
    nats: true,
    rabbitmq: true
  },
  metrics: {
    params: false,
    meta: false
  },
  params: require('./params'),
  handler: require('./handler')
}

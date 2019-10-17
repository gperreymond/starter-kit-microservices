const handler = async (ctx) => {
  console.log('Payload:', ctx.params)
  console.log('Sender:', ctx.nodeID)
  console.log('Metadata:', ctx.meta)
  console.log('The called event name:', ctx.eventName)
}

module.exports = handler

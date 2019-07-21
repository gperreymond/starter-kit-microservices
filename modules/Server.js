const Hapi = require('@hapi/hapi')

const Configuration = require('../config')

class Server {
  constructor () {
    this._instance = new Hapi.Server({
      host: Configuration.host,
      port: Configuration.port,
      routes: {
        cors: true
      }
    })
  }

  getInstance () {
    return this._instance
  }
}

module.exports = Server

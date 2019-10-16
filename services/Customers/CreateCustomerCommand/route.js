const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

const handler = async (req, h) => {
  try {
    await req.moleculer.call('Customers.CreateCustomerCommand', req.payload)
    return h.response({}).code(201)
  } catch (e) {
    return Boom.boomify(e, { statusCode: 400 })
  }
}

module.exports = {
  method: 'post',
  path: '/v1/users',
  handler,
  options: {
    auth: 'simple',
    log: { collect: true },
    tags: ['api', 'Customers'],
    description: 'Create a user in the polagram database',
    payload: {
      allow: ['application/x-www-form-urlencoded', 'application/json']
    },
    validate: {
      payload: {
        email: Joi.string().email().required().description('User email')
      }
    },
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
        responses: {
          201: { description: 'Success' },
          400: { description: 'Bad request' },
          500: { description: 'Internal Server Error' }
        }
      }
    }
  }
}

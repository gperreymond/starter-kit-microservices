const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
  isbn: Joi.string().required()
})

module.exports.query = schema
module.exports.params = schema

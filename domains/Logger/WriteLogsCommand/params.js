const Joi = require('@hapi/joi')

const params = Joi.object().keys({
  index: Joi.string().required(),
  level: Joi.string().required(),
  message: Joi.object().required()
})

module.exports = params

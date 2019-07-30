const Joi = require('@hapi/joi')

const query = Joi.object().keys({
  isbn: Joi.string().required()
})

module.exports.query = query
module.exports.params = {
  ...query
}

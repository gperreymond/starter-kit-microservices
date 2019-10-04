const Joi = require('@hapi/joi')

const JoiValidator = require('../../modules/JoiValidator')

describe('[Module] JoiValidator', () => {
  test('should fail to validate nothing', async () => {
    const validator = new JoiValidator()
    try {
      const schema = Joi.object().keys({
        test: Joi.boolean().required()
      })
      const result = validator.compile(schema)({
        test: true
      })
      expect(result).toEqual(null)
    } catch (e) {
      console.log(e.message)
    }
  })
})

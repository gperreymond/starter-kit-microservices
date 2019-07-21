const { ServiceBroker } = require('moleculer')
const JoiValidator = require('../../../modules/JoiValidator')

const broker = new ServiceBroker({
  logger: false,
  metrics: false,
  validation: true,
  validator: new JoiValidator()
})

beforeAll(async () => {
  broker.loadService('./services/Internal')
  await broker.start()
})
afterAll(async () => {
  await broker.stop()
})

describe('Internal.GetHealthCheckQuery', () => {
  test('should fail because params is not null', async () => {
    try {
      await broker.call('Internal.GetHealthCheckQuery', { test: true })
    } catch (err) {
      expect(err.message).toEqual('Parameters validation error!')
    }
  })
  test('should return a result', async () => {
    const result = await broker.call('Internal.GetHealthCheckQuery')
    expect(result).toHaveProperty('env', 'test')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('version')
  })
})

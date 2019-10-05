const Service = require('../../modules/Service')

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)) // avoid jest open handle error
})

describe('[Module] Service', () => {
  test('should successfully run "created"', async () => {
    const service = new Service()
    await service.getInstance().created()
    expect(true).toEqual(true)
  })
  test('should successfully run "started"', async () => {
    const service = new Service()
    await service.getInstance().started()
    expect(true).toEqual(true)
  })
  test('should successfully run "stopped"', async () => {
    const service = new Service()
    await service.getInstance().stopped()
    expect(true).toEqual(true)
  })
})

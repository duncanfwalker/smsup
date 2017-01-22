process.env.ACTIVE_GATEWAY = 'nexmo';
jest.mock('../gateways/index', () => (
  {
    nexmo: { send: jest.fn(() => Promise.resolve()), routeSetup: 'nexmoSetup' },
    mexcom: { send: jest.fn(() => Promise.resolve()), routeSetup: 'mexcomSetup' },
  }
));

const gateways = require('../gateways');
const { send } = require('../transport');

describe('receiver', () => {
  beforeEach(() => {
    process.env.ACTIVE_GATEWAY = 'nexmo';
  });
  afterEach(() => {
    delete process.env.ACTIVE_GATEWAY;
  });
  it('sends from active gateway', () => {

    send('recipient', 'text');

    expect(gateways.nexmo.send).toBeCalledWith('recipient', 'text');
  });
});

jest.mock('../gatewayMiddleware', () => ({ createReceiveRoute: jest.fn() }));
jest.mock('../../routing/message-router', () => ({ route: jest.fn() }));
const { route } = require('../../routing/message-router');
const receive = require('../receiver');

describe('receiver', () => {
  const passOnResult = result => result;
  const send = jest.fn();
  beforeEach(() => {
    route.mockClear();
    send.mockClear();
  });
  it('sends auto reply', () => {
    const result = 'thanks';
    route.mockReturnValue(new Promise(r => r(result)));

    return receive(send)({}, passOnResult)

      .then(() => expect(send).toBeCalledWith(undefined, 'thanks'));
  });

  it('sends auto reply', () => {
    const result = undefined;
    route.mockReturnValue(new Promise(r => r(result)));

    return receive(send)({}, passOnResult)

      .then(() => expect(send).toHaveBeenCalledTimes(0));
  });
});

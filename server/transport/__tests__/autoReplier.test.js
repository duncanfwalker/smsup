jest.mock('../gatewayMiddleware', () => ({ createReceiveRoute: jest.fn() }));
const autoReplier = require('../autoReplier');

describe('receiver', () => {
  const passOnResult = result => result;
  const receiver = jest.fn(() => Promise.resolve());
  const send = jest.fn();
  beforeEach(() => {
    receiver.mockClear();
    send.mockClear();
  });
  it('sends auto reply', () => {
    const result = 'thanks';
    receiver.mockReturnValue(new Promise(r => r(result)));

    return autoReplier(receiver, send)({}, passOnResult)

      .then(() => expect(send).toBeCalledWith(undefined, 'thanks'));
  });

  it('sends auto reply', () => {
    const result = undefined;
    receiver.mockReturnValue(new Promise(r => r(result)));

    return autoReplier(receiver, send)({}, passOnResult)

      .then(() => expect(send).toHaveBeenCalledTimes(0));
  });
});

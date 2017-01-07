jest.mock('../gatewayMiddleware', () => ({ createReceiveRoute: jest.fn() }));
jest.mock('../../routing/message-router', () => ({ route: jest.fn() }));
const { route } = require('../../routing/message-router');
const receive  = require('../receiver');
const InvalidCommandError = require('../../routing/invalid-command-error');

describe('receiver', () => {
  const passOnResult = result => result;
  const send= jest.fn();
  beforeEach(() => {
    route.mockClear();
    send.mockClear();
  });
  it('sends auto reply', () => {
    const result =  'thanks' ;
    route.mockReturnValue(new Promise((r)=> r(result)));

    return receive(send)({}, passOnResult)

      .then(() => expect(send).toBeCalledWith(undefined, 'thanks'))
  });

  it('sends auto reply', () => {
    const result = undefined;
    route.mockReturnValue(new Promise((r)=> r(result)));


    return receive(send)({}, passOnResult)

      .then(() => expect(send).toHaveBeenCalledTimes(0))
  });

  // TODO: sort out babel-node error transpiling
  // https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend
  xit('sends error reply', () => {
    route.mockReturnValue(new Promise((r)=> r()));
    const throwsError = () => {throw new InvalidCommandError('message')};

    return receive(send)({}, throwsError)

      .then(() => expect(send).toBeCalledWith(undefined, 'message'))
  });
});
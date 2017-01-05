jest.mock('../gatewayMiddleware', () => ({ createReceiveRoute: jest.fn() }));
jest.mock('../transport', () => ({ send: jest.fn() }));
jest.mock('../../routing/message-router', () => ({ route: jest.fn() }));
import { send } from '../transport';
import { route } from '../../routing/message-router';
import { receive } from '../receiver';
import InvalidCommandError from '../../routing/invalid-command-error';

describe('receiver', () => {
  const passOnResult = result => result;
  beforeEach(() => {
    route.mockClear();
    send.mockClear();
  });
  it('sends auto reply', () => {
    const result = { autoReply: 'thanks' };
    route.mockReturnValue(new Promise((r)=> r(result)));

    return receive({}, passOnResult)

      .then(() => expect(send).toBeCalledWith(undefined, 'thanks'))
  });

  it('sends auto reply', () => {
    const result = {};
    route.mockReturnValue(new Promise((r)=> r(result)));


    return receive({}, passOnResult)

      .then(() => expect(send).toHaveBeenCalledTimes(0))
  });

  // TODO: sort out babel-node error transpiling
  // https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend
  xit('sends error reply', () => {
    route.mockReturnValue(new Promise((r)=> r()));
    const throwsError = () => {throw new InvalidCommandError('message')};

    return receive({}, throwsError)

      .then(() => expect(send).toBeCalledWith(undefined, 'message'))
  });
});
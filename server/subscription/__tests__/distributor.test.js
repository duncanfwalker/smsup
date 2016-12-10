jest.mock('../../gateways/nexmo', () => ({ send: jest.fn()  }));
jest.mock('../groupRepo', () => ({ find: jest.fn(() => new Promise((r) => r())) }));

import nexmo from '../../gateways/nexmo';
import { distribute } from '../distributor';
import groupRepo from '../groupRepo';

describe('receive from Nexmo', () => {
  beforeEach(() => {
    nexmo.send.mockClear();
    groupRepo.find.mockClear();
  });
  it('sends message to all group subscribers', () => {
    const alwaysReturnGroup = (resolve) => resolve([{ tag: 'someTag', phoneNumbers: ['+111', '+222'] }]);

    groupRepo.find.mockImplementation(() => new Promise(alwaysReturnGroup));

    return distribute('+000', 'someTag Content of message')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[1])).toEqual(['+111', '+222'])
      );
  });
  it('excludes sender', () => {
    var sender = '+000';
    const groupWithSendIn = (resolve) => resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag Content of message')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[1])).toEqual(['+111'])
      );
  });

  it('excludes sender', () => {
    var sender = '+000';
    const groupWithSendIn = (resolve)=> resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag Content of message')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[1])).toEqual(['+111'])
      );
  });

  it('returns tag matched null when there is no content', () => {
    return distribute('+000', null)

      .then((result) =>
        expect(result).toEqual(null)
      );
  });
});
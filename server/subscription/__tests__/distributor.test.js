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
        expect(nexmo.send.mock.calls.map(args => args[0])).toEqual(['+111', '+222'])
      );
  });
  it('excludes sender', () => {
    var sender = '+000';
    const groupWithSendIn = (resolve) => resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag Content of message')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[0])).toEqual(['+111'])
      );
  });

  it('excludes sender', () => {
    var sender = '+000';
    const groupWithSendIn = (resolve)=> resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag Content of message')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[0])).toEqual(['+111'])
      );
  });

  it('returns tag matched null when there is no content', () => {
    [null, undefined].map((content) => {
      it(`'${content}' content`, () => {
        return distribute('+000', content)

          .then((result) =>
            expect(result).toEqual(null)
          );
      });
    });
  });

  it('sends error message when no group found', () => {
    const noGroupsFound = (resolve)=> resolve([]);

    groupRepo.find.mockImplementation(() => new Promise(noGroupsFound));

    return distribute('+000', 'without tag at start')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[1])).toEqual(
          ["Sorry, you send a message to 'without' but no group with name exists. Start your message with name of a group"])
      );
  });

  it('sends error message when empty group found', () => {
    const emptyGroupFound = (resolve)=> resolve([{ tag: 'someTag', phoneNumbers: [] }]);

    groupRepo.find.mockImplementation(() => new Promise(emptyGroupFound));

    return distribute('+000', 'without tag at start')

      .then(() =>
        expect(nexmo.send.mock.calls.map(args => args[1])).toEqual(
          ["Sorry, you send a message to 'without' but no group with name exists. Start your message with name of a group"])
      );
  });

});
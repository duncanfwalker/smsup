jest.mock('../../transport/transport', () => ({ send: jest.fn() }));
jest.mock('../groupRepo', () => ({ find: jest.fn(() => new Promise(r => r())) }));

const transport = require('../../transport/transport');
const { distribute } = require('../distributor');
const groupRepo = require('../groupRepo');
const DistributionError = require('../../subscription/distribution-error');

describe('receive from Nexmo', () => {
  beforeEach(() => {
    transport.send.mockClear();
    groupRepo.find.mockClear();
  });
  it('sends message to all group subscribers', () => {
    const alwaysReturnGroup = resolve => resolve([{ tag: 'someTag', phoneNumbers: ['+111', '+222'] }]);

    groupRepo.find.mockImplementation(() => new Promise(alwaysReturnGroup));

    return distribute('+000', 'someTag', 'someTag Content of message')

      .then(() => {
        expect(transport.send.mock.calls.length).toEqual(2);
        expect(transport.send.mock.calls.map(args => args[0])).toEqual(['+111', '+222']);
      });
  });
  it('excludes sender', () => {
    const sender = '+000';
    const groupWithSendIn = resolve => resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag', 'someTag Content of message')

      .then(() => expect(transport.send.mock.calls.map(args => args[0])).toEqual(['+111']));
  });

  it('excludes sender', () => {
    const sender = '+000';
    const groupWithSendIn = resolve => resolve([{ tag: 'someTag', phoneNumbers: [sender, '+111'] }]);

    groupRepo.find.mockImplementation(() => new Promise(groupWithSendIn));

    return distribute(sender, 'someTag', 'someTag Content of message')

      .then(() => expect(transport.send.mock.calls.map(args => args[0])).toEqual(['+111']));
  });

  it('returns tag matched null when there is no content', () => {
    [null, undefined].forEach(content =>
      it(`'${content}' content`, () => {
        return distribute('+000', content, content)

          .then(result => expect(result).toEqual(null));
      }));
  });

  it('sends error message when no group found', () => {
    const noGroupsFound = resolve => resolve([]);

    groupRepo.find.mockImplementation(() => new Promise(noGroupsFound));

    return distribute('+000', 'without', 'without tag at start')

      .catch(error => expect(error).toEqual(expect.any(DistributionError)));
  });

  xit('sends error message when empty group found', () => {
    const emptyGroupFound = resolve => resolve([{ tag: 'someTag', phoneNumbers: [] }]);

    groupRepo.find.mockImplementation(() => new Promise(emptyGroupFound));

    return distribute('+000', 'without', 'without tag at start')

      .catch(error => expect(error).toEqual(expect.any(InvalidCommandError)));
  });
});

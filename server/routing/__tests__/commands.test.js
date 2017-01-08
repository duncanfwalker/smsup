jest.mock('../../subscription/groupRepo', () => ({
  addToGroup: jest.fn(() => new Promise(r => r())),
  removeFromGroup: jest.fn(() => new Promise(r => r())),
}));
jest.mock('../../subscription/distributor', () => ({
  distribute: jest.fn(() => new Promise(r => r())),
}));
const groupRepo = require('../../subscription/groupRepo');
const distributor = require('../../subscription/distributor');
const { process } = require('../commands');
const InvalidCommandError = require('../invalid-command-error');

describe('Mobile originated message parsing', () => {
  it('takes command name from the first word payload from second', () => {
    return process({ type: 'join', groupName: 'groupA', sender: 'sender1' })

        .then(() => expect(groupRepo.addToGroup).toBeCalledWith('groupA', 'sender1'));
  });

  it('takes command name from the first word payload from second', () => {
    return process({ type: 'leave', groupName: 'groupA', sender: 'sender1' })

      .then(() => expect(groupRepo.removeFromGroup).toBeCalledWith('groupA', 'sender1'));
  });

  it('when no command is found distribute', () => {
    return process({ type: 'distribute', groupName: 'groupA', sender: 'sender', text: 'groupA none command word' })

      .then(() => expect(distributor.distribute).toBeCalledWith('sender', 'groupA', 'groupA none command word'));
  });

  it('errors when join with no group name', () => {
    function processJoin() {
      process({ type: 'join', sender: 'A' });
    }

    expect(processJoin).toThrow(InvalidCommandError);
  });

  it('auto replies for leave', () => {
    return process({ type: 'leave', groupName: 'groupA', sender: 'sender' })

      .then(result => expect(result).toEqual({ groupName: 'groupA' }));
  });

  it('auto replies for join', () => {
    return process({ type: 'join', groupName: 'groupA', sender: 'sender' })

      .then(result => expect(result).toEqual({ groupName: 'groupA' }));
  });

  it('does not auto replies for distribute', () => {
    return process({ type: 'distribute', groupName: 'groupA', sender: 'sender' })

      .then(result => expect(result).toBeUndefined());
  });

  it('errors on an unknown command', () => {
    function processUnknownCommand() {
      process({ type: 'unknownCommand', groupName: 'groupA', sender: 'sender' });
    }
    expect(processUnknownCommand).toThrow();
  });
});

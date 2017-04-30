jest.mock('../subscription/group-service', () => ({
  addToGroup: jest.fn(() => new Promise(r => r())),
  removeFromGroup: jest.fn(() => new Promise(r => r())),
}));
jest.mock('../subscription/distributor', () => ({
  distribute: jest.fn(() => new Promise(r => r())),
}));
jest.mock('../subscription/user-service', () => ({
  findOrCreateUser: jest.fn(() => new Promise(r => r({}))),
  markTermsAsSeen: jest.fn(() => new Promise(r => r())),
}));
const groupRepo = require('../subscription/group-service');
const distributor = require('../subscription/distributor');
const { join, leave, distribute } = require('../commands');
const InvalidCommandError = require('../routing/invalid-command-error');

describe('Mobile originated message parsing', () => {
  it('takes command name from the first word payload from second', () => {
    return join({ params: { groupName: 'groupA' } }, { sender: 'sender1' })

      .then(() => expect(groupRepo.addToGroup).toBeCalledWith('groupA', 'sender1'));
  });

  it('takes command name from the first word payload from second', () => {
    return leave({ params: { groupName: 'groupA' } }, { sender: 'sender1' })

      .then(() => expect(groupRepo.removeFromGroup).toBeCalledWith('groupA', 'sender1'));
  });

  it('when no command is found distribute', () => {
    return distribute({ params: { groupName: 'groupA' } }, { text: 'groupA none command word', sender: 'sender' })

      .then(() => expect(distributor.distribute).toBeCalledWith('sender', 'groupA', 'groupA none command word'));
  });

  it('errors when join with no group name', () => {
    function processJoin() {
      join({ params: {} }, { sender: 'A' });
    }

    expect(processJoin).toThrow(InvalidCommandError);
  });

  it('auto replies for leave', () => {
    return leave({ params: { groupName: 'groupA' } }, { text: 'sender1', sender: 'sender' })

      .then(result => expect(result).toEqual({ groupName: 'groupA' }));
  });

  it('auto replies for join', () => {
    return join({ params: { groupName: 'groupA' } }, { sender: 'sender1' })

      .then(result => expect(result).toMatchObject({ groupName: 'groupA' }));
  });

  it('does not auto replies for distribute', () => {
    return distribute({ params: { groupName: 'groupA' } }, { text: 'sender1', sender: 'sender' })

      .then(result => expect(result).toBeUndefined());
  });
});

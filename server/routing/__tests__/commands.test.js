jest.mock('../../subscription/groupRepo', () => ({
  addToGroup: jest.fn(() => new Promise((r) => r()))
}));
jest.mock('../../subscription/distributor', () => ({
  distribute: jest.fn(() => new Promise((r) => r()))
}));
import * as groupRepo from '../../subscription/groupRepo';
import * as distributor from '../../subscription/distributor';
import { process } from '../commands';
import InvalidCommandError from '../invalid-command-error';

describe('Mobile originated message parsing', () => {
  it('takes command name from the first word payload from second', () => {
    return process('join', { text: 'groupA', sender: 'sender' }, ['groupA'])

      .then(() =>
        expect(groupRepo.addToGroup).toBeCalledWith('groupA', 'sender')
      );
  });

  it('when no command is found distribute', () => {
    return process('none command word', { text: 'groupA', sender: 'sender' }, [])

      .then(() =>
        expect(distributor.distribute).toBeCalledWith('sender', 'groupA')
      );
  });
  it('ignores further words', () => {
    return process('join', { text: 'groupA unused', sender: 'sender' }, ['groupA', 'unused'])

      .then(() =>
        expect(groupRepo.addToGroup).toBeCalledWith('groupA', 'sender')
      );
  });

  it('errors when join with no group name', () => {
    function processJoin() {
      process('join', { content: 'join', sender: 'A' }, []);
    }

    expect(processJoin).toThrow(InvalidCommandError);
  });

});
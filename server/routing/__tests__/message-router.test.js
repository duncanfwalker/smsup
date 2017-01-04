jest.mock('../commands', () => ({
  process: jest.fn(() => new Promise((r) => r()))
}));
import { route } from '../message-router';
import { process } from '../commands';

describe('Mobile originated message parsing', () => {
  it('takes command name from the first word payload from second', () => {
    route({ text: 'join groupA', sender: 'A' });

    expect(process).toBeCalledWith('join', { text: 'join groupA', sender: 'A' }, ["groupA"])
  });
});
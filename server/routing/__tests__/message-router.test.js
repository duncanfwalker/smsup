jest.mock('../commands', () => ({
  process: jest.fn(() => new Promise((r) => r()))
}));
jest.mock('../aliases', () => ({
  join: { type: 'join' }
}));
import { route } from '../message-router';
import { process } from '../commands';

describe('Mobile originated message parsing', () => {
  beforeEach(() => {
    process.mockClear();
  });
  it('takes command name from the first word payload from second', () => {
    route({ text: 'join groupA', sender: 'A' });

    expect(process).toBeCalledWith({ type: 'join', sender: 'A', groupName: 'groupA' })
  });

  it('ignores further words', () => {
    route({ text: 'join groupA sdd', sender: 'A' });

    expect(process).toBeCalledWith({ type: 'join', sender: 'A', groupName: 'groupA' })
  });

  it('uses distribute as default command type', () => {
    route({ text: 'none command word', sender: 'A' });

    expect(process).toBeCalledWith({
      type: 'distribute',
      groupName: 'none',
      sender: 'A',
      text: 'none command word',
    })
  });
});
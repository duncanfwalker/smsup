jest.mock('../commands', () => ({
  process: jest.fn(() => new Promise((r) => r()))
}));
jest.mock('../aliases', () => () => ({
  join: { type: 'join', language: 'en' },
  'پیوستن': { type: 'join', language: 'fa' }
}));
jest.mock('../auto-reply', () => jest.fn());
const { route } = require('../message-router');
const { process } = require('../commands');
const createAutoReply = require('../auto-reply')

describe('Mobile originated message parsing', () => {
  beforeEach(() => {
    process.mockClear();
  });
  it('passes viewName, view model and options to auto replier', () => {
    process.mockReturnValue(new Promise((r) => r({groupName: 'groupA'})));

    return route({ text: 'join groupA', sender: 'A' }).then( () =>
     expect(createAutoReply).toBeCalledWith('join', {groupName: 'groupA' }, {language: 'en'})
    );
  });

  it('takes command name from the first word payload from second', () => {
    route({ text: 'join groupA', sender: 'A' });

    expect(process.mock.calls[0][0]).toMatchObject({ type: 'join',groupName: 'groupA'  });
  });

  it('takes command name first character in right-to-left scripts', () => {
    route({ text: 'پیوستن رهبران', sender: 'A' });

    expect(process.mock.calls[0][0]).toMatchObject({ type: 'join' });
  });

  it('ignores further words', () => {
    route({ text: 'join groupA sdd', sender: 'A' });

    expect(process.mock.calls[0][0]).toMatchObject({ type: 'join', sender: 'A', groupName: 'groupA' })
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
const createAliases = require('../aliases');

describe('Mobile originated message parsing', () => {
  beforeEach(() => {
    process.env.SUPPORTED_LOCALES = 'fa,en'
  });
  it('', () => {
    const commandTypes = ['join', 'leave'];
    expect(createAliases(commandTypes)).toEqual(
      {
        'leave': { language: 'en', type: 'leave' },
        'join': { language: 'en', type: 'join' },
        'ترک': { language: 'fa', type: 'leave' },
        'پیوستن': { language: 'fa', type: 'join' },
      }
    );
  });
});
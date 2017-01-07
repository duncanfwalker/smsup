const aliases = require('../aliases');

describe('Mobile originated message parsing', () => {
  it('takes command name from the first word payload from second', () => {
    expect(aliases).toEqual(
      {
        'leave': {language: 'eng', type: 'leave'},
        'join': {language: 'eng', type: 'join'},
      }
    );
  });
});
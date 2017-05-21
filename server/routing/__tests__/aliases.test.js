const createAliases = require('../aliases');

describe('Mobile originated message parsing', () => {
  beforeEach(() => {
    process.env.SUPPORTED_LOCALES = 'fa,en';
  });
  it('', () => {
    expect(createAliases('leave')).toEqual(
      [{ locale: 'fa', alias: 'خروج' }, { locale: 'en', alias: 'leave' }],
    );
  });
});

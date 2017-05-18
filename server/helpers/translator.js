const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  // eslint-disable-next-line prefer-template,no-path-concat
  directory: __dirname + '/../locales',
  syncFiles: !(process.env.NODE_ENV === 'production'),
});

function translator(locale) {
  // eslint-disable-next-line no-underscore-dangle
  return (phrase, values) => i18n.__({ phrase, locale }, values);
}

module.exports = translator;

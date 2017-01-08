const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  directory: __dirname + '/../locales',
  syncFiles: true,
});

function translator(locale) {
  return (phrase, values) => i18n.__({ phrase, locale }, values);
}

module.exports = translator;
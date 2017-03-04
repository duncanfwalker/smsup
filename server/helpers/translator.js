const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  directory: path.resolve(__dirname, './../locales'),
  syncFiles: !(process.env.NODE_ENV === 'production'),
});

function translator(locale) {
  // eslint-disable-next-line no-underscore-dangle
  return (phrase, values) => i18n.__({ phrase, locale }, values);
}

module.exports = translator;

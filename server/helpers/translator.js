const i18n = require('i18n');
const path = require('path');

// TODO: sort out including locale files in build
const locales = process.env.NODE_HOME === '/app/.heroku/node' ? './../server/locales' : './../locales';
i18n.configure({
  locales: (process.env.SUPPORTED_LOCALES || 'en').split(','),
  defaultLocale: 'en',
  directory: path.resolve(__dirname, locales),
  syncFiles: !(process.env.NODE_ENV === 'production'),
});

function translator(locale) {
  // eslint-disable-next-line no-underscore-dangle
  return (phrase, values) => i18n.__({ phrase, locale }, values);
}

module.exports = translator;

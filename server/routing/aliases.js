const translator = require('../helpers/translator');

function createAliases(word) {
  // ISO 639-2 language codes
  const locales = (process.env.SUPPORTED_LOCALES || 'en,fa').split(',');

  return locales.map(locale => ({ locale, alias: translator(locale)(word) }));
}

module.exports = createAliases;

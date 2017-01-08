const translator = require('../helpers/translator');

function createAliases(types) {
  // ISO 639-3 language codes
  const locales = (process.env.SUPPORTED_LOCALES || 'en').split(',');

  return locales.reduce(function (dictionary, language) {
    const translate = translator(language);
    types.forEach(function (type) {
      const localTranslation = translate(type);
      return dictionary[localTranslation] = { language, type };
    });
    return dictionary
  }, {});
}
module.exports = createAliases;

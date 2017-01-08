const translator = require('../helpers/translator');

function createDictionary(translate, language, types) {
  const languageDictionary = {};
  types.forEach((type) => {
    const localTranslation = translate(type);
    languageDictionary[localTranslation] = { language, type };
    return languageDictionary;
  });

  return languageDictionary;
}

function createAliases(types) {
  // ISO 639-3 language codes
  const locales = (process.env.SUPPORTED_LOCALES || 'en').split(',');

  return locales.reduce((universalDictionary, language) => {
    const translate = translator(language);
    const languageDictionary = createDictionary(translate, language, types);

    return Object.assign(universalDictionary, languageDictionary);
  }, {});
}
module.exports = createAliases;

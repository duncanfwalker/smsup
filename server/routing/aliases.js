// ISO 639-3 language codes
const input = {
  'eng': {
    'leave': 'leave',
    'join': 'join'
  }
};

function createDictionary(language, keywords) {
  return Object.keys(keywords).reduce(function (dictionary, type) {
    const localAlias = keywords[type];
    dictionary[localAlias] = { language, type };
    return dictionary;
  }, {});
}

export default Object.keys(input).reduce(function (dictionary, language) {
  return Object.assign(dictionary, createDictionary(language, input[language]));
}, {});
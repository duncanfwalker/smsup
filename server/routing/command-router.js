const createAliases = require('./aliases');
const InvalidCommandError = require('../routing/invalid-command-error');
const viewRender = require('./view-render');


function findLanguage(moText, pattern) {
  const moWords = moText.match(/([^\s]*)/gi).filter(token => !['', ' '].includes(token));
  const patternWord = pattern.match(/([^\s]*)/gi).filter(token => !['', ' '].includes(token));
  const aliasOfFirstWord = createAliases(patternWord[0]).find(alias => alias.alias === moWords[0]);
  return aliasOfFirstWord ? aliasOfFirstWord.locale : undefined;
}

function createRegexMatcher(route) {
  const pattern = route.pattern;
  const keywordMatcher = /([a-zA-Z_$][a-zA-Z0-9_$]+)/g;
  const paramMatcher = /\:([a-zA-Z_$][a-zA-Z0-9_$]*)/g; // eslint-disable-line no-useless-escape

  let match;
  const paramNames = [];
  while ((match = paramMatcher.exec(pattern))) { // eslint-disable-line no-cond-assign
    paramNames.push(match[1]);
  }

  function replacer(keyword) {
    const translations = createAliases(keyword);
    return `(?:${translations.map(t => t.alias).join('|')})`;
  }

  if (pattern.includes('*')) {
    paramNames.push('splat');
  }

  const valuePattern = pattern
    .replace(/\*/, '(.*)')
    .replace(paramMatcher, '([^\\s]+)')
    .replace(keywordMatcher, replacer)
    .replace(/\s/g, '\\s');


  const paramValueMatcher = new RegExp(`^${valuePattern}$`, 'g');

  return (text) => {
    const result = paramValueMatcher.exec(text);
    if (result) {
      const skipFullMatch = 1;
      const values = result ? result.slice(skipFullMatch) : [];

      const zipParams = paramNames
        .reduce((all, name, index) => (Object.assign({}, all, { [name]: values[index] })), {});

      return { route, params: zipParams };
    }
    return false;
  };
}


function matchRoutes(routes, text) {
  const matchers = routes.map(createRegexMatcher);

  return matchers.reduce((match, matcher) => (match !== false ? match : matcher(text)), false);
}

/**
 * @typedef {Object|*} MobileOriginated message
 * @property {string} sent - Date and time message was sent
 * @property {string} gateway - the SMS gateway that handle
 * @property {string} id - gateway message
 * @property {string} text - text content of the SMS
 * @property {string} sender - phone number
 */
function create() {
  const routes = [];
  function Command(pattern) {
    return function decorator(target, method) {
      routes.push({ pattern, action: target[method], view: method });
    };
  }

  function run(mo) {
    const match = matchRoutes(routes, mo.text);
    if (match === false) {
      return Promise.reject(new InvalidCommandError());
    }

    const options = { language: findLanguage(mo.text, match.route.pattern) };
    return match.route.action({ params: match.params }, mo)
      .then(viewModel => viewRender(match.route.view, viewModel, options));
  }

  function clear() {
    routes.length = 0;
  }

  return { Command, run, clear };
}


module.exports = create();

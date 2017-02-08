const createAliases = require('./aliases');
const InvalidCommandError = require('../routing/invalid-command-error');
const viewRender = require('./view-render');

const aliases = createAliases(['join', 'leave']);

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
    }
  }

  function run(mo) {
    const match = matchRoutes(routes,mo.text);
    if(match === false) {
      return Promise.reject(new InvalidCommandError());
    }
    const words = mo.text.match(/([^\s]*)/gi).filter(token => !['', ' '].includes(token));
    const first = words[0];
    const lang = aliases[first];

    return match.route.action({ params: match.params }, mo)
      .then(viewModel => viewRender(match.route.view, viewModel, lang ? lang : {language: 'en'}  ));
  }

  function clear() {
    routes.length = 0;
  }

  return {Command, run, clear};
}

function createRegexMatcher(route) {
  const pattern = route.pattern;
  const paramMatcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

  let match, paramNames = [];
  while ((match = paramMatcher.exec(pattern))) {
    paramNames.push(match[1]);
  }

  if(pattern.includes('*')) {
    paramNames.push('splat');
  }

  const valuePattern = pattern
    .replace(/\*/,'(.*)')
    .replace(paramMatcher, '([^\\s]+)')
    .replace(/\s/g, '\\s');


  const paramValueMatcher = new RegExp('^'+ valuePattern + '$', 'g');

  return (text) => {
    const result = paramValueMatcher.exec(text);
    if (result) {
      const skipFullMatch = 1;
      const values = result ? result.slice(skipFullMatch) : [] ;

      const zipParams = paramNames
        .reduce((params, name, index) => (Object.assign({},params, { [name]: values[index] })), {});

      return { route: route, params: zipParams };
    }
    return false;
  }
}


function matchRoutes(routes, text) {
  const matchers = routes.map(createRegexMatcher);

  return matchers.reduce((match, matcher) => (match !== false ? match : matcher(text)), false);
}

module.exports = create();

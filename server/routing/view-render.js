const autoReplies = require('../views/auto-replies');
const translator = require('../helpers/translator');
const { join } = require('../helpers/formater');

function viewRender(view, viewModel, options) {
  const helpers = { __: translator(options.language), join };
  const viewAutoReply = autoReplies[view];
  if (typeof viewAutoReply === 'function') return viewAutoReply(viewModel, helpers);
  return undefined;
}

module.exports = viewRender;

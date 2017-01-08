const autoReplies = require('../views/auto-replies');
const translator = require('../helpers/translator');

function autoReply(view, viewModel, options) {
  const helpers = { __: translator(options.language) };
  const viewAutoReply = autoReplies[view];
  if (typeof viewAutoReply === 'function') return viewAutoReply(viewModel, helpers);
  return undefined;
}

module.exports = autoReply;

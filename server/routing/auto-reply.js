const autoReplies = require('../views/auto-replies');
const translator = require('../helpers/translator');

function autoReply(view, viewModel, options) {
  const helpers = { __: translator(options.language) };
  const autoReply = autoReplies[view];
  if (typeof autoReply === 'function') return autoReply(viewModel, helpers);
}

module.exports = autoReply;

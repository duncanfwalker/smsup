const { errorMessages, unknownError } = require('../views/errors');
const translator = require('../helpers/translator');
const logger = require('winston');

function errorHandler(error, options) {
  const helpers = { __: translator(options.language) };
  const viewAutoReply = errorMessages[error.name];
  if (typeof viewAutoReply !== 'function') {
    logger.error('Unhandled error', error);
    return unknownError({}, helpers);
  }
  return viewAutoReply(error, helpers);
}

module.exports = errorHandler;

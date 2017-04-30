const Message = require('../repositories/message-repository');

function recordMessage(mo, params) {
  return new Message({ mo, params }).save();
}

module.exports = { recordMessage };

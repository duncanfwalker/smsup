const Message = require('../repositories/message-repository');

function recordMessage(mo, params) {
  return new Message({ mo, params }).save();
}

function list() {
  return Message.find()
    .select('mo.text mo.gateway mo.gatewayId mo.sender  mo.sent')
    .then(messages => messages.map(m => m.mo));
}

module.exports = { recordMessage, list };

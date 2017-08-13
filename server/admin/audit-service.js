const Message = require('../repositories/message-repository');

function recordMessage(mo, params) {
  return new Message({ mo, params }).save();
}

function list({ offset, pageSize }) {
  return Message.find().limit(pageSize).skip(offset)
    .select('mo.text mo.gateway mo.gatewayId mo.sender  mo.sent')
    .sort({ 'mo.sent': 'desc' })
    .then(messages => messages.map(m => m.mo));
}

module.exports = { recordMessage, list };

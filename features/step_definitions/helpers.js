const Group = require('./../../server/repositories/group-repository');
const User = require('./../../server/repositories/user-repository');
const Message = require('./../../server/repositories/message-repository');

function clearAll() {
  return Promise.all([
    User.remove({}),
    Group.remove({}),
    Message.remove({}),
  ]);
}

module.exports = { clearAll };

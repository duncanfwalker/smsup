const Group = require('./../../server/repositories/group-repository');
const User = require('./../../server/repositories/user-repository');

function clearAll() {
  return Promise.all([
    User.remove({}),
    Group.remove({}),
  ]);
}

module.exports = { clearAll };

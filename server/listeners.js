const { notifyAdmins, addModerators } = require('./admin/admin-service');
const { on } = require('./routing/command-listener');

function listenForCommandEvents() {
  on('create', event => addModerators(event.params.groupName));
  on('create', event => notifyAdmins(event.params.groupName));
}

module.exports = listenForCommandEvents;

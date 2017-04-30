const { notifyAdmins, addModerators } = require('./admin/admin-service');
const { recordMessage } = require('./admin/audit-service');
const { on } = require('./routing/command-listener');

function listenForCommandEvents() {
  on('create', event => addModerators(event.params.groupName));
  on('create', event => notifyAdmins(event.params.groupName));
  on(null, event => recordMessage(event.mo, event.params));
}

module.exports = listenForCommandEvents;

const groupService = require('../subscription/group-service');
const { send } = require('../transport/transport');
const viewRender = require('../routing/view-render');

function getModerators() {
  return (process.env.SUPER_ADMIN_PHONE_NUMBERS || '').split(',');
}

function addModerators(groupName) {
  const promises = getModerators()
    .map(phoneNumber => groupService.addToGroup(groupName, phoneNumber));
  return Promise.all(promises);
}

function notifyAdmins(groupName) {
  const notification = viewRender('notify', { groupName, eventName: 'created' }, { language: 'en' });
  const promises = getModerators().map(moderator => send(moderator, notification));
  return Promise.all(promises);
}

module.exports = { addModerators, notifyAdmins };

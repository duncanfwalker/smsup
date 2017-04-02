const viewRender = require('./../routing/view-render');
const { send } = require('../transport/transport');

function invite(phoneNumbers, groupName, language, keyword) {
  const prefix = keyword !== undefined ? `${keyword} ` : '';
  const invitation = viewRender('invitation', { groupName, prefix }, { language });
  return Promise.all(phoneNumbers.map(number => send(number, invitation)))
    .then(() => ({ invited: phoneNumbers }));
}

module.exports = { invite };

const viewRender = require('./../routing/view-render');
const { send } = require('../transport/transport');
const { findOrCreateUser, markTermsAsSeen } = require('./user-service');
const Promise = require('bluebird');
const logger = require('winston');

const createInviter = (groupName, prefix, language) => phoneNumber => findOrCreateUser(phoneNumber)
  .then((user) => {
    const viewModel = { groupName, prefix, includeTerms: !user.hasSeenTerms };
    const invitation = viewRender('invitation', viewModel, { language });
    return send(user.phoneNumber, invitation)
      .then(() => markTermsAsSeen(user.phoneNumber))
      .catch(error => logger.error(`Failed to invite ${user.phoneNumber}`, error));
  });

function invite(phoneNumbers, groupName, language, keyword) {
  const prefix = keyword !== undefined ? `${keyword} ` : '';

  const inviter = createInviter(groupName, prefix, language);
  return Promise.all(phoneNumbers.map(inviter));
}

module.exports = { invite };

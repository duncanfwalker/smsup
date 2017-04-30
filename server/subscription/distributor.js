const groupRepo = require('./group-service');
const { send } = require('../transport/transport');
const DistributionError = require('./distribution-error');


function findDistributionList(groupName) {
  return groupRepo.find(groupName)
    .then((groups) => {
      const firstMatch = groups[0];
      if (firstMatch === undefined) throw new DistributionError(groupName);
      return firstMatch;
    });
}
/**
 *
 * @param {string} sender
 * @param groupName
 * @param {string} content
 * @return {Promise.<>}
 */
function distribute(sender, groupName, content) {
  if (typeof content !== 'string') return Promise.resolve(null);

  return findDistributionList(groupName)
    .then(({ phoneNumbers, tag }) => {
      phoneNumbers
        .filter(recipient => recipient !== sender)
        .map(recipient => send(recipient, content));
      return tag;
    });
}

module.exports = { distribute };

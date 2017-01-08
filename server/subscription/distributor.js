const groupRepo = require('./groupRepo');
const { send } = require('../transport/transport');
const InvalidCommandError = require('../routing/invalid-command-error');


function findDistributionList(groupName) {
  return groupRepo.find(groupName)
    .then((groups) => {
      const firstMatch = groups[0];
      if (firstMatch === undefined) throw new InvalidCommandError(`Sorry, you send a message to '${groupName}' but no group with name exists. Start your message with name of a group`);
      else if (firstMatch.phoneNumbers.length === 0) throw new InvalidCommandError('No numbers in group');
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

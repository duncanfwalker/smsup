const groupRepo = require( './groupRepo');
const {send} = require( '../transport/transport');
const DistributionError = require( './distribution-error');

/**
 *
 * @param {string} sender
 * @param {string} content
 * @return {Promise.<>}
 */
function distribute(sender, content) {
  if(typeof content !== 'string' ) return Promise.resolve(null);

  return findDistributionList(content)
    .then(({ phoneNumbers, tag }) => {
      phoneNumbers
        .filter(recipient => recipient !== sender)
        .map(recipient => send(recipient, content));
      return tag;
    })

    .catch(error => {
      send(sender, `Sorry, you send a message to '${error.tag}' but no group with name exists. Start your message with name of a group`);
    });
}

function findDistributionList(content) {
  const firstWord = content.split(/\b/)[0];
  return groupRepo.find(firstWord)
    .then(groups => {
      const firstMatch = groups[0];
      if(firstMatch === undefined) throw new DistributionError("No matching groups", firstWord);
      else if(firstMatch.phoneNumbers.length === 0) throw new DistributionError("No numbers in group", firstWord);
      return firstMatch;
    });
}

module.exports = {distribute};
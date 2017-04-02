const groupRepo = require('./subscription/groupRepo');
const { distribute } = require('./subscription/distributor');
const { invite } = require('./subscription/invitations');
const InvalidCommandError = require('./routing/invalid-command-error');
const { Command } = require('./routing/command-router');

function parseInvite(splat) {
  const tokens = splat.split(' ')
    .filter(el => typeof el === 'string')
    .map(string => string.trim());

  const groupName = tokens[tokens.length - 1];
  const phoneNumbers = tokens.splice(0, tokens.length - 2);
  return { phoneNumbers, groupName };
}

const actions = {
  @Command('join :groupName')
  join({ params: { groupName } }, { sender }) {
    if (!groupName) throw new InvalidCommandError('No group name specified');
    return groupRepo
      .addToGroup(groupName, sender)
      .then(() => ({ groupName }));
  },
  @Command('leave :groupName')
  leave({ params: { groupName } }, { sender }) {
    return groupRepo
      .removeFromGroup(groupName, sender)
      .then(() => ({ groupName }));
  },
  @Command('create :groupName')
  create({ params: { groupName } }, { sender }) {
    return groupRepo
      .create(groupName, sender)
      .then(() => ({ groupName }));
  },
  @Command('delete :groupName')
  delete({ params: { groupName } }, { sender }) {
    return groupRepo
      .removeFromGroup(groupName, sender)
      .then(() => ({ groupName }));
  },
  @Command('invite *')
  invite({ params: { splat }, language }, { keyword }) {
    const { phoneNumbers, groupName } = parseInvite(splat);
    return invite(phoneNumbers, groupName, language, keyword);
  },
  @Command(':groupName *')
  distribute({ params: { groupName } }, { sender, text }) {
    return distribute(sender, groupName, text);
  },
};

module.exports = actions;

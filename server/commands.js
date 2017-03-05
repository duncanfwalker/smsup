const groupRepo = require('./subscription/groupRepo');
const { distribute } = require('./subscription/distributor');
const InvalidCommandError = require('./routing/invalid-command-error');
const { Command } = require('./routing/command-router');


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
  @Command(':groupName *')
  distribute({ params: { groupName } }, { sender, text }) {
    return distribute(sender, groupName, text);
  },
};

module.exports = actions;

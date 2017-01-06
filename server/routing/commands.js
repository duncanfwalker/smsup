import groupRepo from '../subscription/groupRepo';
import { distribute } from '../subscription/distributor';
import InvalidCommandError from './invalid-command-error';

const actions = {
  join({ groupName, sender }) {
    if (!groupName) throw new InvalidCommandError("No group name specified");
    return groupRepo
      .addToGroup(groupName, sender)
      .then(() => ({ groupName }))
  },
  leave({ groupName, sender }) {
    return groupRepo
      .removeFromGroup(groupName, sender)
      .then(() => ({ groupName }))
  },
  distribute({ sender, groupName, text }) {
    return distribute(sender, text).then(() => ({}));
  },
};

/**
 *
 * @param command
 * @return {Promise}
 */
export function process(command) {
  const action = actions[command.type];
  if (typeof action !== 'function') throw new Error("No action found for command", command);
  return action(command);
}

export default actions;

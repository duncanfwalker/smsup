import groupRepo from '../subscription/groupRepo';
import { distribute } from '../subscription/distributor';
import InvalidCommandError from './invalid-command-error';

/**
 *
 * @param keyword
 * @param {...MobileOriginated} mo
 * @param {string[]} words
 * @return {Promise}
 */
export function process(keyword, mo, words) {
  const command = commands[keyword];
  if (command) return command(mo, words);
  else return distribute(mo.sender, mo.text).then(() => ({}));
}

const commands = {
  join: (mo, words) => {
    const groupName = words[0];
    if (!groupName) throw new InvalidCommandError("No group name specified");
    return groupRepo.addToGroup(groupName, mo.sender)
      .then(() => ({
        autoReply: `You have joined the ${groupName} group. The terms of use are ....`
      }))
  },
  leave: (mo, words) => {
    const groupName = words[0];
    return groupRepo.removeFromGroup(groupName, mo.sender)
      .then(() => ({
        autoReply: `You have left the ${groupName} group.`
      }))
  },
};

export default commands;
import groupRepo from '../subscription/groupRepo';
import {distribute} from '../subscription/distributor';
import InvalidCommandError from './invalid-command-error';

const commands = {
  join: (mo, words) => {
    const groupName = words[0];
    console.log(groupName);
    if(!groupName) throw new InvalidCommandError("No group name specified");
    return groupRepo.addToGroup(groupName,mo.sender)
  },
};

export function process(keyword, mo, words) {
  const command = commands[keyword];
  if(command) return command(mo, words);
  else return distribute(mo.sender, mo.text);
}
export default commands;
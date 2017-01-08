const {process} = require('./commands');
const createAliases = require('./aliases') ;
const InvalidCommandError = require('../routing/invalid-command-error');
const createAutoReply = require('./auto-reply');

const aliases = createAliases(['join', 'leave']);
/**
 * @typedef {Object|*} MobileOriginated message
 * @property {string} sent - Date and time message was sent
 * @property {string} gateway - the SMS gateway that handle
 * @property {string} id - gateway message
 * @property {string} text - text content of the SMS
 * @property {string} sender - phone number
 */
/**
 * @param {...MobileOriginated} mo message
 */
function route(mo) {
  const command = createCommand(mo.text, mo.sender);
  const {language} = command;
  return process(command)
    .then(result => createAutoReply(command.type, result, {language}))
    .catch(InvalidCommandError, error => error.message);
}

function createCommand(text, sender) {
  const words = text.match(/([^\s]*)/gi).filter(token => !['',' '].includes(token) );
  const command = aliases[words[0]];
  if (command) {
    return Object.assign(command, { groupName: words[1], sender: sender });
  }
  return { type: 'distribute', text, groupName: words[0], sender: sender };
}

module.exports = {route};
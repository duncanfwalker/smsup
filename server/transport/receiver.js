import InvalidCommandError from '../routing/invalid-command-error';
import {route} from '../routing/message-router';
import {send} from './transport';

export function receive(mo, respondToGateway) {
  return route(mo)
    .then(respondToGateway)
    .then(result => {
      if(result.autoReply !== undefined) send(mo.sender, result.autoReply);
      return result;
    })
    .catch(InvalidCommandError, error => send(mo.sender, error.message));
}

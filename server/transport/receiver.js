
import {route} from '../routing/message-router';
import {send} from './transport';

export function receive(mo, respondToGateway) {
  return route(mo)
    .then(respondToGateway)
    .then(autoReply => {
      if(autoReply !== undefined) send(mo.sender, autoReply);
      return autoReply;
    });
}

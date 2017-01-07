const {route} = require('../routing/message-router');

function setupMoResponder(send) {
  return function moResponder(mo, respondToGateway) {
    return route(mo)
      .then(respondToGateway)
      .then(autoReply => {
        if(autoReply !== undefined) send(mo.sender, autoReply);
        return autoReply;
      });
  }
}

module.exports = setupMoResponder;

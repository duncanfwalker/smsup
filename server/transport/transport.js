const gateways = require('./gateways/index');
const logger = require('winston');
const { Router } = require('express');
const autoReplier = require('./autoReplier');
const transport = {
  /**
   *
   * @param recipient
   * @param text
   */
  send(recipient, text) {
    return gateways[process.env.ACTIVE_GATEWAY].send(recipient, text)
      .catch(e => logger.error('MT Error', e));
  },
  /**
   *
   * @param receiver
   * @return Router
   */
  createReceiveRoutes(receiver) {
    const router = Router();
    const receiverAndReply = autoReplier(receiver,this.send);
    Object.keys(gateways)
      .forEach(name => {
        router.use(gateways[name].createMORoute(receiverAndReply))
      });

    return router;
  }
};

module.exports = transport;

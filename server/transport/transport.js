const gateways = require('./gateways/index');
const logger = require('winston');
const { Router } = require('express');

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

    Object.keys(gateways)
      .forEach(name => {
        router.use(gateways[name].createMORoute(receiver))
      });

    return router;
  }
};

module.exports = transport;

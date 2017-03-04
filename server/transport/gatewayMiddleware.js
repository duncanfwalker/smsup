const express = require('express');
const logger = require('winston');

const router = express.Router(); // eslint-disable-line new-cap

/**
 *
 * @return {Router}
 * @param setup {Object} convert received body to an mo
 * @param setup.createMO {Function} convert received body to an mo
 * @param setup {Object} convert received body to an mo
 * @param receiver
 */
function createReceiveRoute({ createMO, method, respondOk, name }, receiver) {
  router[method](`/api/${name}/mo`, (req, res) => {
    logger.log('info', 'MO headers: %j', req.headers);
    logger.log('info', 'MO body: %j', req.body);

    receiver(createMO(req.body, req.query))
      .then(() => respondOk(res));
  });
  return router;
}

module.exports = { createReceiveRoute };

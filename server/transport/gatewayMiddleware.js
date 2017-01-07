const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const logger = require('winston');
/**
 *
 * @return {Promise}
 * @param path
 * @param receivingAdapter convert received body to an mo
 * @param method http method
 * @param receiver
 */
function createReceiveRoute({path, receivingAdapter, method}, receiver) {
  router[method](path, (req, res) => {
    const mo = receivingAdapter(req.body);
    receiver(mo,responseToGateway)
      .catch(handleUnknownError);

    function responseToGateway(result) {
      res.json({});
      return result;
    }

    function handleUnknownError(error) {
      logger.error('Error handling MO', error);

      res.status(500).send({ error: 'Unknown error' });
    }
  });
  return router;
}

module.exports = {createReceiveRoute};

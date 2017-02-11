const express = require('express');
const logger = require('winston');

const router = express.Router(); // eslint-disable-line new-cap

/**
 *
 * @return {Promise}
 * @param path
 * @param receivingAdapter convert received body to an mo
 * @param method http method
 * @param receiver
 */
function createReceiveRoute({ path, receivingAdapter, method }, receiver) {
  router[method](path, (req, res) => {

    logger.log('info', 'MO headers: %j', req.headers);
    logger.log('info', 'MO body: %j', req.body);

    function responseToGateway(result) {
      res.json({});
      return result;
    }

    function handleUnknownError(error) {
      logger.error('Error handling MO', error);

      res.status(500).send({ error: 'Unknown error' });
    }

    const mo = receivingAdapter(req.body);
    receiver(mo, responseToGateway)
      .catch(handleUnknownError);
  });
  return router;
}

module.exports = { createReceiveRoute };

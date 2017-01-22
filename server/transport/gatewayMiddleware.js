const express = require('express');
const logger = require('winston');

const router = express.Router(); // eslint-disable-line new-cap

/**
 *
 * @return {Router}
 * @param path
 * @param receivingAdapter convert received body to an mo
 * @param method http method
 * @param receiver
 */
function createReceiveRoute({ createMO,  method, respondOk, name }, receiver) {
  router[method](`/api/${name}/mo`,(req, res) => {
    logger.log('info', 'MO headers: %j', req.headers);
    logger.log('info', 'MO body: %j', req.body);

    function handleUnknownError(error) {
      logger.error('Error handling MO', error);

      res.status(500).send({ error: 'Unknown error' });
    }

    receiver(createMO(req.body, req.query))
      .then(() => respondOk(res))
      .catch(handleUnknownError);
  });
  return router;
}

module.exports = { createReceiveRoute };

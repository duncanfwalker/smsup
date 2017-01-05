const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const nexmo = require('././gateways/nexmo');
const messageRouter = require('./routing/message-router');
import InvalidCommandError from './routing/invalid-command-error';
import logger from 'winston';

// TODO: extract this to gateways
router.post('/mo/nexmo', (req, res) => {
  const mo = nexmo.receivingAdapter(req.body);

  const sendAutoReply = (text) => nexmo.send(mo.sender, text);
  const responseToGateway = (result) => {
    res.json({});
    return result;
  };

  messageRouter.route(mo)
    .then(responseToGateway)
    .then(result => {
      if(result.autoReply !== undefined)
        sendAutoReply(result.autoReply);
      return result;
    })
    .catch(InvalidCommandError, error => sendAutoReply(error.message))
    .catch(handleUnknownError);

  function handleUnknownError(error) {
    logger.error('Error handling MO', error);
    res.status(500).send({ error: 'Unknown error' });
  }

});

module.exports = router;

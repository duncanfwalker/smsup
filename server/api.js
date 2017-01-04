const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const nexmo = require('././gateways/nexmo');
const messageRouter = require('./routing/message-router');

// TODO: extract this to gateways
router.post('/mo/nexmo', (req, res) => {
  const mo = nexmo.receivingAdapter(req.body);

  messageRouter.route(mo)
    .then(tag => res.json({ target: tag}))
    .catch((error) => {
      console.error(error);
      res.json({ status: 'bad' })
    });
});

module.exports = router;

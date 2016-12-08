const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const distributor = require('./../services/distributor');
const nexmo = require('./../services/gateways/nexmo');

// TODO: extract this to gateways
router.post('/receive', (req, res) => {
  const { sender, text } = nexmo.receivingAdapter(req.body);
  distributor.distribute(sender, text)
    .then(tag => {
      res.json({ target: tag});
    })
    .catch((error) => {
      console.error(error);
      res.json({ status: 'bad' })
    });
});

module.exports = router;

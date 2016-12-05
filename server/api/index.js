const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const groupAdmin = require('./../services/groupRepo');
const distributor = require('./../services/distributor');
const nexmo = require('./../services/gateways/nexmo');
import { GROUPS_PATH } from '../../client/src/api';

router.get(GROUPS_PATH, (req, res) => {
  groupAdmin.list()
    .then((group) => res.json(group));
});

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

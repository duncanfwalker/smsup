const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const distributor = require('./subscription/distributor');
const nexmo = require('././gateways/nexmo');
const ipfilter = require('express-ipfilter').IpFilter;


const nexmoIps = ['174.37.245.32/29', '174.36.197.192/28', '173.193.199.16/28', '173.193.199.16/28'];
const localIps = ['127.0.0.1', '::1'];
router.use(ipfilter([...nexmoIps, ...localIps], { mode: 'allow' }));

// TODO: extract this to gateways
router.post('/mo/nexmo', (req, res) => {
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

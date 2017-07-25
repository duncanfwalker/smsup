const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const schema = new mongoose.Schema({
  mo: Object,
  params: Object,
  recipients: Array,
});

const Message = mongoose.model('Message', schema);

module.exports = Message;

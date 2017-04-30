const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongooseDelete = require('mongoose-delete');

mongoose.Promise = Promise;

const schema = new mongoose.Schema({
  tag: String,
  phoneNumbers: [String],
});
schema.plugin(mongooseDelete, { overrideMethods: 'all' });

const Group = mongoose.model('Group', schema);

module.exports = Group;

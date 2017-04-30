const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongooseDelete = require('mongoose-delete');

mongoose.Promise = Promise;

const schema = new mongoose.Schema({
  phoneNumber: String,
  acceptedTerms: Boolean,
  hasSeenTerms: { type: Boolean, default: false },
});
schema.plugin(mongooseDelete, { overrideMethods: 'all' });

schema.methods.acceptTerms = function acceptTerms() {
  this.acceptedTerms = true;
};

const User = mongoose.model('User', schema);

module.exports = User;

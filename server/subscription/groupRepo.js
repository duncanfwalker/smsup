const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODBURI);

const Group = mongoose.model('Group', new mongoose.Schema({
  tag: String,
  phoneNumbers: [String],
}));

/**
 *
 * @param tag
 * @return {Promise}
 */
function find(tag) {
  return Group.find({ tag }).select('tag phoneNumbers');
}


function update({ tag, phoneNumbers }) {
  return Group.update({ tag }, { tag, phoneNumbers }, { upsert: true })
    .then(() => ({ tag, phoneNumbers }));
}
/**
 *
 * @param groups
 * @return {Promise.<>}
 */
function save(groups) {
  return Promise.all(groups.map(update));
}

/**
 *
 * @return {Promise}
 */
function list() {
  return Group.find({}).select('tag phoneNumbers');
}

/**
 *
 * @param tag
 * @param phoneNumber
 * @return {Promise}
 */
function addToGroup(tag, phoneNumber) {
  return Group.update({ tag }, { $push: { phoneNumbers: phoneNumber } });
}

/**
 *
 * @param tag
 * @param phoneNumber
 * @return {Promise}
 */
function removeFromGroup(tag, phoneNumber) {
  return Group.update({ tag }, { $pull: { phoneNumbers: phoneNumber } });
}

module.exports = {
  find,
  save,
  list,
  addToGroup,
  removeFromGroup,
};

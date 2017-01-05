import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
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
  return new Promise((resolve) => Group.find({ tag }, (err, groups) => resolve(groups)).select('tag phoneNumbers'));
}

/**
 *
 * @param groups
 * @return {Promise.<>}
 */
function save(groups) {
  return Promise.all(
    groups.map(
      ({ tag, phoneNumbers }) => new Promise(
        (resolve) => Group.update({ tag }, { tag, phoneNumbers }, { upsert: true }, () => resolve({ tag, phoneNumbers }))
      )
    ));
}

/**
 *
 * @return {Promise}
 */
function list() {
  return new Promise((resolve) => Group.find({}, (err, groups) => resolve(groups)).select('tag phoneNumbers'));
}

/**
 *
 * @param tag
 * @param phoneNumber
 * @return {Promise}
 */
function addToGroup(tag, phoneNumber) {
  return new Promise((resolve) => Group.update( { tag }, { $push: { phoneNumbers: phoneNumber } }, resolve))
}

/**
 *
 * @param tag
 * @param phoneNumber
 * @return {Promise}
 */
function removeFromGroup(tag, phoneNumber) {
  return new Promise((resolve) => Group.update( { tag }, { $pull: { phoneNumbers: phoneNumber } }, resolve))
}

module.exports = {
  find,
  save,
  list,
  addToGroup,
  removeFromGroup
};

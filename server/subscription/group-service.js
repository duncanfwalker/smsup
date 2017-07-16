const GroupNotFoundError = require('./group-not-found-error');
const Group = require('../repositories/group-repository');

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

function clearAll() {
  return Group.remove({});
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
  return Group.update({ tag }, { $addToSet: { phoneNumbers: phoneNumber } });
}

function create(tag, phoneNumber) {
  return Group.create({ tag, phoneNumbers: [phoneNumber] });
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

function deleteGroup(tag) {
  return Group.find({ tag }).select('tag phoneNumbers')
    .then((groups) => {
      if (groups.length < 1) {
        throw new GroupNotFoundError(tag);
      }
      return Group.delete({ tag });
    });
}

module.exports = {
  find,
  update,
  save,
  list,
  create,
  addToGroup,
  removeFromGroup,
  clearAll,
  deleteGroup,
};

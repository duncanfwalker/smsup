import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODBURI);

const Group = mongoose.model('Group', new mongoose.Schema({
  tag: String,
  phoneNumbers: [String],
}));

function find(tag) {
  return new Promise((resolve) => Group.find({ tag }, (err, groups) => resolve(groups)).select('tag phoneNumbers'));
}

function save(groups) {
  return Promise.all(
    groups.map(
      ({ tag, phoneNumbers }) => new Promise(
        (resolve) => Group.update({ tag }, { tag, phoneNumbers }, { upsert: true }, () => resolve({ tag, phoneNumbers }))
      )
    ));
}

function list() {
  return new Promise((resolve) => Group.find({}, (err, groups) => resolve(groups)).select('tag phoneNumbers'));
}

function addToGroup(tag, phoneNumber) {
  return new Promise((resolve) => Group.update( { tag }, { $push: { phoneNumbers: phoneNumber } }, resolve))
}

module.exports = {
  find,
  save,
  list,
  addToGroup,
};

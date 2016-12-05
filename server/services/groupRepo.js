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

module.exports = {
  find,
};

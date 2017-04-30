const User = require('../repositories/user-repository');

function findOrCreateUser(phoneNumber) {
  return User.findOne({ phoneNumber })
    .then((existingUser) => {
      return existingUser === null ? new User({ phoneNumber }) : existingUser;
    });
}

function markTermsAsSeen(phoneNumber) {
  return findOrCreateUser(phoneNumber)
    .then((user) => {
      user.hasSeenTerms = true; // eslint-disable-line no-param-reassign
      return user.save();
    });
}


module.exports = { findOrCreateUser, markTermsAsSeen };

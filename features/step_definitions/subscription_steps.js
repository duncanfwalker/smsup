const { defineSupportCode } = require('cucumber');
const {expect} = require('chai');
const { save, clearAll } = require('../../server/subscription/groupRepo');
const { sendMessage, getNumbersReceiving } = require('./sms_steps');

function recieveMessagesSentToGroup(phoneNumber, isSubscribeExpected, group, done) {
  const message = `${group} ${Math.random().toString(36)}`;
  sendMessage('some number', message, () => {
    expect(getNumbersReceiving(message).includes(phoneNumber)).to.equal(isSubscribeExpected);
    done();
  });
}

defineSupportCode(({ Given, After, Then }) => {
  After(() => clearAll());

  Given(/^that phone numbers (.*) are subscribed to the (.*) group$/, (subscribers, tags) => {
    const phoneNumbers = subscribers.split(',');
    const groups = tags.split(',').map(tag => ({ tag, phoneNumbers }));
    // TODO: do subscription instead of using db directly
    save(groups);
  });

  Given(/^I am a member of that all (.*) group$/, (tag) => {
    // TODO: do subscription instead of using db directly
    save({ tag, phoneNumbers: [''] });
  });

  Given(/^that the '(.*)' group exists$/, (tag) => {
    save([{ tag, phoneNumbers: [] }]);
  });

  Given(/^I am not a member of the '(.*)' group$/, (groupName, done) => {
    sendMessage('', `leave ${groupName}`, done);
  });

  Then(/^I am( not)? subscribed to the '(.*)' group$/, (hasNot, group, done) => {
    recieveMessagesSentToGroup('', hasNot === undefined, group, done);
  });

  Then(/^'(.*)' is( not)? subscribed to the '(.*)' group$/, (phoneNumber, hasNot, group, done) => {
    recieveMessagesSentToGroup(phoneNumber, hasNot === undefined, group, done);
  });
});

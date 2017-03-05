const { defineSupportCode } = require('cucumber');
const {expect} = require('chai');
const { save, clearAll } = require('../../server/subscription/groupRepo');
const { sendMessage, getNumbersReceiving } = require('./sms_steps');

defineSupportCode(({ Given, After, Then }) => {
  After(() => clearAll());

  Given(/^that phone numbers (.*) are subscribed to the (.*) group$/, (subscribers, tags) => {
    const phoneNumbers = subscribers.split(',');
    const groups = tags.split(',').map(tag => ({ tag, phoneNumbers }));
    // TODO: do subscription instead of using db directly
    save(groups);
  });

  Given(/^that the '(.*)' group exists$/, (tag) => {
    save([{ tag, phoneNumbers: [] }]);
  });

  Then(/^I am( not)? subscribed to the '(.*)' group$/, (hasNot, group, done) => {
    const expectSubscribed = (hasNot === undefined);
    const message = `${group} ${Math.random().toString(36)}`;
    sendMessage('some number', message, () => {
      expect(getNumbersReceiving(message).includes('')).to.equal(expectSubscribed);
      done();
    });
  });
});

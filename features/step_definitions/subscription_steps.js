const { defineSupportCode } = require('cucumber');
const {save} = require('../../server/subscription/groupRepo');

defineSupportCode(function ({ Given }) {
  Given(/^that phone numbers (.*) are subscribed to the (.*) group$/, (subscribers, tags) => {
    const phoneNumbers = subscribers.split(',');
    const groups = tags.split(',').map(tag => ({ tag, phoneNumbers }));
    // TODO: do subscription instead of using db directly
    save(groups);
  });

  Given(/^that the '(.*)' group exists$/, (tag) => {
    save([{ tag, phoneNumbers: [] }]);
  });

});

const { defineSupportCode } = require('cucumber');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');


defineSupportCode(({ Given, Then, Before }) => {
  Before(() => {
    process.env.SUPER_ADMIN_PHONE_NUMBERS = undefined;
  });

  Given(/^admin phone numbers are '(.*)'$/, (phoneNumbers) => {
    process.env.SUPER_ADMIN_PHONE_NUMBERS = phoneNumbers;
  });

  Then(/^the message history should be as follows:$/, (table) => {
    const expected = table.hashes().map(message => ({
      text: message['MO text'],
    }));

    return request(app)
      .get('/admin/messages/')
      .expect(200)
      .then((res) => {
        const actual = res.body.messages.map(({ text }) => ({ text }));
        expect(actual).to.deep.equal(expected);
      });
  });
});

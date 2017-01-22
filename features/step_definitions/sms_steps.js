const { defineSupportCode } = require('cucumber');
const request = require('supertest');
const app = require('../../server');
const nock = require('nock');
const {expect} = require('chai');

defineSupportCode(function ({ Given, When, Then, Before, After }) {
  let mtRequests = [];
  nock('https://rest.nexmo.com/')
    .persist()
    .post('/sms/json')
    .reply(200, function(url, requestBody) {
      mtRequests.push(requestBody);
      return {};
    });
  Before(function () {
    mtRequests = [];
  });

  When(/^(?:I|phone numbers? )(.*) sends? an SMS to SMSUP with content '(.*)'$/, (numbers, content, done) => {
    numbers
      .split(',')
      .forEach(number => sendMessage(number, content, done))
  });


  Then(/^(?:I|phone numbers? )(.*) received (\d+) messages?$/, (numbers, occurrences) => {
    expect(countMessagesReceivedBy(numbers)).to.eql(Number(occurrences));
  });

  Then(/^(?:I|phone numbers? )(.*) receives? an SMS with the content '(.*)'$/, (numbers, content) => {
    expect(getNumbersReceiving(content)).to.include.members(numbers.split(','));
  });

  function sendMessage(sender, content, done) {
    request(app)
      .post('/api/nexmo/mo')
      .send({ messageId: 'dsfsd', text: content, msisdn: sender, 'message-timestamp': '' })
      .expect('Content-Type', /json/)
      .expect(200, done);
  }

  function countMessagesReceivedBy(numbers) {
    return mtRequests
      .filter(message => numbers.split(',').includes(message.to))
      .length;
  }

  function getNumbersReceiving(text) {
    return mtRequests
      .filter(message => message.text === text)
      .map(message => message.to);
  }
});

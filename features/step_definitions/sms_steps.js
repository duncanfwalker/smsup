const { defineSupportCode } = require('cucumber');
const request = require('supertest');
const app = require('../../server');
const nock = require('nock');
const {expect} = require('chai');


let mtRequests = [];
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

function details(content) {
  return `${content} not in ${JSON.stringify(mtRequests)}`;
}

nock('https://rest.nexmo.com/')
  .persist()
  .post('/sms/json')
  .reply(200, (url, requestBody) => {
    mtRequests.push(requestBody);
    return {};
  });

defineSupportCode(({ When, Then, Before }) => {
  Before(() => { mtRequests = []; });

  When(/^(?:I|phone numbers? )(.*) sends? an SMS to SMSUP with content '(.*)'$/, (numbers, content, done) => {
    numbers
      .split(',')
      .forEach(number => sendMessage(number, content, done));
  });

  Then(/^(?:I|phone numbers? )(.*) received (\d+) messages?$/, (numbers, occurrences) => {
    expect(countMessagesReceivedBy(numbers)).to.eql(Number(occurrences), details(numbers));
  });

  Then(/^(?:I|phone numbers? )(.*) receives? an SMS with the content '(.*)'$/, (numbers, content) => {
    expect(getNumbersReceiving(content)).to.include.members(numbers.split(','), details(content));
  });

  Then(/^(?:I|phone numbers? )(.*) receives? an SMS with the content '(.*)' '(.*)' times$/, (number, content, times) => {
    const matchingRequests = mtRequests.filter(({ to, text }) => to === number && text === content);
    expect(matchingRequests).to.have.lengthOf(times, details(content));
  });
});


module.exports = { sendMessage, getNumbersReceiving };

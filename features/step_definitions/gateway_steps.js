const { defineSupportCode } = require('cucumber');
const request = require('supertest');
const nock = require('nock');
const { expect } = require('chai');
const app = require('../../server');

defineSupportCode(({ Given, When, Then, Before, After }) => {
  let mexcomMT = [];

  function sendThroughMexcom(sender, content, done) {
    const options = { msisdn: sender, body: content, time: '', moid: 1, shortcode: '' };
    request(app)
      .get('/api/mexcom/mo')
      .query(options)
      .expect(200, done);
  }

  Before(() => {
    nock('http://bulk.ezlynx.net:7001')
      .persist()
      .get('/BULK/BULKMT.aspx')
      .query((actualQueryObject) => {
        mexcomMT.push(actualQueryObject);
        return true;
      })
      .reply(200, {});
    mexcomMT = [];
  });

  After(() => {
    process.env.ACTIVE_GATEWAY = 'nexmo';
  });

  Given(/^that SMSUP is using the '(.*)' gateway$/, (gateway) => {
    process.env.ACTIVE_GATEWAY = gateway;
    process.env.MEXCOM_PREMIUM_KEYWORDS = 'APPS10';
  });

  Given(/^(.*) join the 'any' group'$/, (phoneNumber, done) => {
    sendThroughMexcom(phoneNumber, 'join any', done);
  });

  When(/^phone number (.*) sends an SMS through Mexcom with content '(.*)'$/, function (sender, content, done) {
    sendThroughMexcom(sender, content, done);
  });

  Then(/^I receive an SMS through 'mexcom'$/, () => {
    const anyHiInHex = '0061006E0079002000680069';
    expect(mexcomMT.map(mt => mt.body)).to.include(anyHiInHex);
  });
});

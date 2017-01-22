const { defineSupportCode } = require('cucumber');
const request = require('supertest');
const nock = require('nock');
var decache = require('decache');
const {expect} = require('chai');

let app;

defineSupportCode(({ Given, When, Then, Before }) => {
  let mexcomMT = [];
  function sendThroughMexcom(sender, content, done) {
    const options = {msisdn: sender, body: content, time: '', moid: 1, shortcode:'' };
    request(app)
      .get('/api/mo/mexcom')
      .query(options)
      .expect('Content-Type', /json/)
      .expect(200, done);
  }

  Before(function () {
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

  Given(/^that SMSUP is using the '(.*)' gateway$/, (gateway) => {
    process.env.ACTIVE_GATEWAY = gateway;
    decache('../../server.js');
    app=require('../../server.js')
  });

  Given(/^(.*) join the 'any' group'$/, (phoneNumber, done) => {
    sendThroughMexcom(phoneNumber, 'join any', done)
  });

  When(/^phone number (.*) sends an SMS through Mexcom with content '(.*)'$/, function (sender, content, done) {
    sendThroughMexcom(sender, content, done);
  });

  Then(/^I receive an SMS through 'mexcom'$/, () => {
    expect(mexcomMT).to.have.lengthOf(1);
  });
});

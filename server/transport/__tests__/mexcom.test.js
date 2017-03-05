const mockFetchResolve = { status: 200, json: () => ({ response: 'value' }) };
jest.mock('isomorphic-fetch', () => jest.fn(() => Promise.resolve(mockFetchResolve)));
const fetch = require('isomorphic-fetch');
const { createMO, send } = require('../gateways/mexcom');

describe('MexCom', () => {
  describe('receive MO', () => {
    it('converts to our message format', () => {
      const mexcomMO = {
        msisdn: '60123456789',
        body: 'APPS10 Hello7',
        time: '2016-01-0100:00:01',
        moid: 'mexcom-id-number',
        shortcode: '60000',
        telcoid: '2',
      };

      const mo = createMO({}, mexcomMO);

      expect(mo).toMatchObject({
        sent: '2016-01-01T00:00:01Z',
        gateway: 'mexcom',
        gatewayId: 'mexcom-id-number',
        text: 'Hello7',
        sender: '60123456789',
      });
    });
  });

  describe('send MT', () => {
    let originalEnv;
    const recipient = '60123456789';
    const text = '你好吗？';
    beforeEach(() => {
      originalEnv = process.env;
      process.env.MEXCOM_USERNAME = 'name';
      process.env.MEXCOM_PASSWORD = 'pass';
    });
    afterEach(() => {
      process.env = originalEnv;
      fetch.mockClear();
    });
    it('sends to Nexmo', () => {
      send(recipient, text);

      const urlWithCredentials = /^http:\/\/bulk\.ezlynx\.net:7001\/BULK\/BULKMT\.aspx\?user=&pass=&smstype=UTF8&msisdn=60123456789&body=4F60597D5417FF1F&sender=MEXCOM/;
      expect(fetch.mock.calls[0][0]).toMatch(urlWithCredentials);
    });

    it('maps fields', () => {
      send(recipient, text);

      const fieldsInQueryString = /smstype=UTF8&msisdn=60123456789&body=4F60597D5417FF1F/; // utf8 e4bda0e5a5bde59097efbc9f desired 4F60597D5417FF1F
      expect(fetch.mock.calls[0][0]).toMatch(fieldsInQueryString);
    });


    it('returns promise', () => {
      return send('recipient', 'text')
        .then(response => expect(response).toEqual(true));
    });
  });
});

const mockFetchResolve = { status: 200, json: () => ({ response: 'value' }) };
jest.mock('isomorphic-fetch', () => jest.fn(() => Promise.resolve(mockFetchResolve)));
const fetch = require('isomorphic-fetch');
const { createMO, send } = require('../gateways/nexmo');

describe('receive from Nexmo', () => {
  it('converts to our message format', () => {
    const nexmoMO = {
      msisdn: '441632960960',
      to: '441632960961',
      messageId: '02000000E68951D8',
      text: 'Hello7',
      type: 'unicode',
      keyword: 'HELLO7',
      'message-timestamp': '2016-07-05 21:46:15',
    };
    const converted = createMO(nexmoMO);


    const standardFormat = {
      sent: '2016-07-05T21:46:15Z',
      gateway: 'nexmo',
      gatewayId: '02000000E68951D8',
      text: 'Hello7',
      sender: '441632960960',
    };
    expect(converted).toEqual(standardFormat);
  });

  it('always has text', () => {
    const minimalNexmoMO = {
      text: null,
      'message-timestamp': '2016-07-05 21:46:15',
    };
    const converted = createMO(minimalNexmoMO);

    expect(converted.text).toEqual('');
  });
});

describe('sends to Nexmo', () => {
  let originalEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env.NEXMO_API_KEY = 'key';
    process.env.NEXMO_API_SECRET = 'secret';
    process.env.MT_SENDER = 'NEXMO';
  });
  afterEach(() => {
    process.env = originalEnv;
    fetch.mockClear();
  });
  it('posts to Nexmo', () => {
    send();
    expect(fetch.mock.calls[0][0]).toBe('https://rest.nexmo.com/sms/json');
    expect(fetch.mock.calls[0][1]).toMatchObject({
      body: '{"from":"NEXMO","type":"unicode","api_key":"key","api_secret":"secret"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('maps fields', () => {
    const recipient = '+7301373';
    const text = 'body';

    send(recipient, text);

    expect(fetch.mock.calls[0][1]).toEqual({
      body: `{"to":"${recipient}","from":"NEXMO","text":"${text}","type":"unicode","api_key":"key","api_secret":"secret"}`,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });


  it('returns promise', () => {
    return send('recipient', 'text')
      .then(response => expect(response).toEqual(true));
  });

  it('throws error on bad status response', () => {
    jest.mock('isomorphic-fetch', () => {
      const resolveWithBadResponse = resolve => resolve({ status: 401 });
      return jest.fn(() => new Promise(resolveWithBadResponse));
    });

    return send('recipient', 'text')

      .catch((e) => {
        expect(e).toEqual(new Error('Bad response from server'));
      });
  });
});

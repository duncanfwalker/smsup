jest.mock('isomorphic-fetch', () => {
  return jest.fn(() => new Promise((resolve, reject)=> {
    resolve(
      {
        status: 200,
        json: jest.fn(() => ({ 'response': 'value' }))
      }
    )
  }));
});
import fetch from 'isomorphic-fetch';
import { receivingAdapter, send } from '../nexmo';

describe('receive from Nexmo', () => {
  it('converts to our message format', () => {
    const nexmoMO = {
      msisdn: '441632960960',
      to: '441632960961',
      messageId: '02000000E68951D8',
      text: 'Hello7',
      type: 'text',
      keyword: 'HELLO7',
      'message-timestamp': '2016-07-05 21:46:15',
    };
    const converted = receivingAdapter(nexmoMO);


    var standardFormat = {
      sent: '2016-07-05T21:46:15Z',
      gateway: 'nexmo',
      gatewayId: '02000000E68951D8',
      text: 'Hello7',
      sender: '441632960960'
    };
    expect(converted).toEqual(standardFormat)
  });

  it('always has text', () => {
    const minimalNexmoMO = {
      text: null,
      'message-timestamp': '2016-07-05 21:46:15',
    };
    const converted = receivingAdapter(minimalNexmoMO);

    expect(converted.text).toEqual('')
  });


});

describe('sends to Nexmo', () => {
  let originalEnv;
  beforeEach(() => {
    originalEnv = process.env;
    process.env.NEXMO_API_KEY = 'key';
    process.env.NEXMO_API_SECRET = 'secret'
  });
  afterEach(() => {
    process.env = originalEnv;
    fetch.mockClear();
  });
  it('posts to Nexmo', () => {
    send();
    expect(fetch.mock.calls[0][0]).toBe('https://rest.nexmo.com/sms/json');
    // expect([]).toMatchObject({ TODO: find out why toMatchObject isn't working
    //   body: '{"api_key":"API_KEY","api_secret":"API_SECRET"}',
    //   headers: { 'Content-Type': 'application/json' },
    //   method: 'POST'
    // });
  });

  it('maps fields', () => {
    var sender = '+5376';
    var recipient = '+7301373';
    var text = 'body';

    send(sender, recipient, text);

    expect(fetch.mock.calls[0][1]).toEqual({
      body: `{"to":"${recipient}","from":"NEXMO","text":"${text}","api_key":"key","api_secret":"secret"}`,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });
  });


  it('returns promise', () => {
    return send('sender', 'recipient', 'text')
      .then(response => expect(response).toEqual({ 'response': 'value' }));
  });

  it('throws error on bad status response', () => {
    jest.mock('isomorphic-fetch', () => {
      const resolveWithBadResponse = (resolve) => resolve({ status: 401 });
      return jest.fn(() => new Promise(resolveWithBadResponse));
    });

    return send('sender', 'recipient', 'text')

      .catch((e) => {
        expect(e).toEqual(new Error("Bad response from server"));
      });
  });

});

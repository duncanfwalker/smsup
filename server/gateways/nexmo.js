import fetch from 'isomorphic-fetch';

export function send(sender, recipient, text) {
  const postOptions = createBody({ to: recipient, from: 'NEXMO', text });

  console.log(`POSTing to Nexmo ${JSON.stringify(postOptions)}`);

  return fetch('https://rest.nexmo.com/sms/json', postOptions).then(checkStatus);
}

function createBody(messageSpecific) {
  const authentication = {
    api_key: process.env.NEXMO_API_KEY,
    api_secret: process.env.NEXMO_API_SECRET
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({}, messageSpecific, authentication)),
  };
}

export function receivingAdapter(body) {
  var nexmoDate = body['message-timestamp'];
  return {
    sent: nexmoDate ? nexmoDate.replace(/ /g, "T").concat("Z") : new Date().toISOString(),
    gateway: 'nexmo',
    id: body.messageId,
    text: body.text,
    sender: body.msisdn,
  };
}


function checkStatus(response) {
  console.log(`Response from Nexmo '${JSON.stringify(response)}'`);

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return response.json();
}


export default { send, receivingAdapter }
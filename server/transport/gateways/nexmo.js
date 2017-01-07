const fetch = require('isomorphic-fetch');
const logger = require('winston');

const routeSetup = {
  path: '/mo/nexmo',
  method: 'post',
  receivingAdapter
};

/**
 *
 * @param {string} recipient
 * @param {string} text
 * @return {*}
 */
function send(recipient, text) {
  const postOptions = createBody({ to: recipient, from: process.env.MT_SENDER, text });

  logger.info(`POSTing to Nexmo`, postOptions);

  return fetch('https://rest.nexmo.com/sms/json', postOptions).then(checkStatus);
}

/**
 *
 * @param body
 * @return {...MobileOriginated|*}
 */
function receivingAdapter(body) {
  var nexmoDate = body['message-timestamp'];
  return {
    sent: nexmoDate ? nexmoDate.replace(/ /g, "T").concat("Z") : new Date().toISOString(),
    gateway: 'nexmo',
    gatewayId: body.messageId,
    text: (body.text || ''),
    sender: body.msisdn,
  };
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

function checkStatus(response) {
  logger.info(`Response from Nexmo`, {url: response.url, status: response.status, statusText: response.statusText});

  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }

  return response.json();
}


module.exports = { send, routeSetup };

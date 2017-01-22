const fetch = require('isomorphic-fetch');
const logger = require('winston');
const { createReceiveRoute } = require('../gatewayMiddleware');

function createMTBody(messageSpecific) {
  const authentication = {
    api_key: process.env.NEXMO_API_KEY,
    api_secret: process.env.NEXMO_API_SECRET,
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({}, messageSpecific, {type: 'unicode' }, authentication)),
  };
}

function checkMTResponse(response) {
  logger.info('Response from Nexmo', { url: response.url, status: response.status, statusText: response.statusText });

  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }
  return true;
}

/**
 *
 * @param body
 * @return {...MobileOriginated|*}
 */
function createMO(body) {
  const nexmoDate = body['message-timestamp'];
  return {
    sent: nexmoDate ? nexmoDate.replace(/ /g, 'T').concat('Z') : new Date().toISOString(),
    gateway: 'nexmo',
    gatewayId: body.messageId,
    text: (body.text || ''),
    sender: body.msisdn,
  };
}

module.exports = {
  createMO,
  /**
   *
   * @param {string} recipient
   * @param {string} text
   * @return {*}
   */
  send(recipient, text) {
    const postOptions = createMTBody({ to: recipient, from: process.env.MT_SENDER, text });

    logger.info('POSTing to Nexmo', postOptions);

    return fetch('https://rest.nexmo.com/sms/json', postOptions)
      .then(checkMTResponse);
  },
  /**
   *
   * @param receiver
   * @return Route
   */
  createMORoute(receiver) {
    const routeOptions = {
      method: 'post',
      createMO,
      respondOk: (res) => {
        res.json({});
        return res;
      },
      name: 'nexmo'
    };
    return createReceiveRoute(routeOptions, receiver);
  }
};

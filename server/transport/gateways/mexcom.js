const fetch = require('isomorphic-fetch');
const logger = require('winston');
const buffer = require('buffer');
const querystring = require('querystring');
const iconv = require('iconv-lite');
const { createReceiveRoute } = require('../gatewayMiddleware');

const mtUri = 'http://bulk.ezlynx.net:7001/BULK/BULKMT.aspx';
const gatewayName = 'mexcom';

function createQueryString(recipient, text) {
  const auth = { user: process.env.MEXCOM_BULK_USERNAME, pass: process.env.MEXCOM_BULK_PASSWORD };

  const query = {
    smstype: 'UTF8',
    msisdn: recipient,
    body: iconv.encode(`${text}`,'UTF-16BE').toString("hex").toUpperCase(),
    sender: 'MEXCOM',
  };

  let stringify = querystring.stringify(Object.assign(auth, query));

  logger.info(stringify);

  return stringify;
}

function checkMTResponse(response) {
  logger.info('Response from Mexcom', { url: response.url, status: response.status, statusText: response.statusText });

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
function createMO(body, queryParams) {
  const mexcomDate = queryParams.time;
  return {
    sent: mexcomDate ? mexcomDate.slice(0,10)+'T'+ mexcomDate.slice(10)+'Z' : new Date().toISOString(),
    gateway: gatewayName,
    gatewayId: queryParams.moid,
    text: queryParams.body,
    sender: queryParams.msisdn,
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
    const query = createQueryString(recipient, text);

    logger.info('GETing to Mexcom', query);

    return fetch(`${mtUri}?${query}`)
      .then(checkMTResponse);
  },
  /**
   *
   * @param receiver
   * @return Route
   */
  createMORoute(receiver) {

    const routeOptions = {
      method: 'get',
      createMO,
      respondOk: (res) => {
        res.send('-1');
        return res;
      },
      name: gatewayName
    };
    return createReceiveRoute(routeOptions, receiver);
  }
};

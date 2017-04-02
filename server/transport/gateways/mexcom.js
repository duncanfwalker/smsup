const fetch = require('isomorphic-fetch');
const logger = require('winston');
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
    body: iconv.encode(`${text}`, 'UTF-16BE').toString('hex').toUpperCase(),
    sender: 'MEXCOM',
  };

  return querystring.stringify(Object.assign(auth, query));
}

function checkMTResponse(response) {
  logger.info('Response from Mexcom', { url: response.url, status: response.status, statusText: response.statusText });

  if (response.status >= 400) {
    throw new Error('Bad response from server');
  }
  return true;
}

function couldBeHex(string) {
  return /[0-9A-F]{6}/.test(string);
}

function decode(text) {
  if (couldBeHex(text)) {
    try {
      const hexBuffer = new Buffer(text, 'hex');
      return iconv.decode(hexBuffer, 'UTF-16BE');
    } catch (e) {
      logger.info('Could not decode so assumed plain text', text);
    }
  }
  return text;
}

/**
 *
 * @param body
 * @param queryParams
 * @return {...MobileOriginated|*}
 */
function createMO(body, queryParams) {
  const mexcomDate = queryParams.time;

  const text = decode(queryParams.body);

  const keywords = process.env.MEXCOM_PREMIUM_KEYWORDS.split(',').join('|');
  const keywordPattern = new RegExp(`^(${keywords}) `, 'i');
  const keywordMatch = keywordPattern.exec(text);
  const keyword = keywordMatch !== null ? keywordMatch[1] : undefined;
  return {
    sent: mexcomDate ? `${mexcomDate.slice(0, 10)}T${mexcomDate.slice(10)}Z` : new Date().toISOString(),
    gateway: gatewayName,
    gatewayId: queryParams.moid,
    text: text ? text.replace(keywordPattern, '') : undefined,
    sender: queryParams.msisdn,
    keyword,
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
      name: gatewayName,
    };
    return createReceiveRoute(routeOptions, receiver);
  },
};

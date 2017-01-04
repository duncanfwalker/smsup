import { process } from './commands';

/**
 * @typedef {Object|*} MobileOriginated message
 * @property {string} sent - Date and time message was sent
 * @property {string} gateway - the SMS gateway that handle
 * @property {string} id - gateway message
 * @property {string} text - text content of the SMS
 * @property {string} sender - phone number
 */
/**
 * @param {...MobileOriginated} mo message
 */
export function route(mo) {
  const [keyword, ...tail] = mo.text.split(/\b/);
  return process(keyword, mo, tail.filter(token => token !== ' '));
}

import { process } from './commands';

/**
 *
 * @param mo
 */
export function route(mo) {
  const [keyword, ...tail] = mo.text.split(/\b/);
  return process(keyword, mo, tail.filter(token => token !== ' '));
}

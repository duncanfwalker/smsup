import groupRepo from './groupRepo';
import nexmo from '../gateways/nexmo';

export function distribute(sender, content) {
  if(typeof content !== 'string' ) return Promise.resolve(null);

  return findDistributionList(content)
    .then(({ phoneNumbers, tag }) => {
      phoneNumbers
        .filter(recipient => recipient !== sender)
        .map(recipient => nexmo.send(sender, recipient, content));
      return tag;
    });
}

function findDistributionList(content) {
  const firstWord = content.split(/\b/)[0];
  return groupRepo.find(firstWord).then(groups => groups[0] || { phoneNumbers: [] });
}

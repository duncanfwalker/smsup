import { defineSupportCode } from 'cucumber';
import { expect } from 'chai';
import {save} from '../../server/subscription/groupRepo';

defineSupportCode(function ({ Given }) {
  Given(/^that phone numbers (.*) are subscribed to the (.*) group$/, (subscribers, tags) => {
    const phoneNumbers = subscribers.split(',');
    const groups = tags.split(',').map(tag => ({ tag, phoneNumbers }));
    // TODO: do subscription instead of using db directly
    save(groups);
  });
});

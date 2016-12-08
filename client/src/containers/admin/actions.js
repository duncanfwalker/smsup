import { GROUP_UPDATED } from './constants';

export const groupUpdated = ({ tag, phoneNumbers }) => {
  return { type: GROUP_UPDATED, payload: { tag, phoneNumbers }};
};

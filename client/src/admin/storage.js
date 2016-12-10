import { transformers } from 'redux-api';
import { GROUP_UPDATED } from './constants';

export const GROUPS_PATH = '/group';

const groups = {
  url: GROUPS_PATH,
  crud: true,
  transformer: transformers.array,
  options: {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  },
  reducer(state = [], action) {
    switch (action.type) {
      case GROUP_UPDATED:
        var number = state.data.findIndex((group) => action.payload.tag === group.tag);
        var data = immutableSplice(state.data, number, 1, action.payload);
        return Object.assign({}, state, { data });
      default:
        return state;
    }
  }
};

function immutableSplice(arr, start, deleteCount, ...items) {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
}

export default groups;

import { transformers } from 'redux-api';
import reducer from './reducer';

const groups = {
  url: '/group/(:id)',
  crud: true,
  transformer: transformers.array,
  options: {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  },
  reducer,
};

export default groups;

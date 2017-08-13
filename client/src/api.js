import 'isomorphic-fetch';
import reduxApi, { transformers } from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import groups from './groups/reducer';
import messages from './messages/reducer';

const optionsCreator = (url, params, getState) => {
  return {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
};

const endpoints = {
  groups: {
    url: '/admin/group/(:id)',
    crud: true,
    transformer: transformers.array,
    reducer: groups,
  },
  messages: {
    url: '/admin/messages/',
    crud: true,
    reducer: messages,
  },
};


export default reduxApi(endpoints)
  .use('fetch', adapterFetch(fetch))
  .use('options', optionsCreator)
  .use('responseHandler', (err, data) => {
    if (err === 'Unauthorized') {
      window.location = '/login';
    }
    return data;
  });

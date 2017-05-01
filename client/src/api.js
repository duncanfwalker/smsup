import 'isomorphic-fetch';
import reduxApi from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import groups from './admin/storage';

const optionsCreator = (url, params, getState) => {
  return {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
};

export default reduxApi({
  groups,
})
  .use('fetch', adapterFetch(fetch))
  .use('options', optionsCreator);

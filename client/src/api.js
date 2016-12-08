import 'isomorphic-fetch';
import reduxApi from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import groups from './api/groups';

export default reduxApi({
  groups,
}).use("fetch", adapterFetch(fetch));

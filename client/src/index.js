import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './containers/admin/admin';
import './index.css';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';

const store = configureStore({}, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Admin} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

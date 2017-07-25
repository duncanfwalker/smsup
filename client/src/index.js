import React from 'react';
import ReactDOM from 'react-dom';
import Groups from './groups/container';
import Messages from './messages/container';
import './index.css';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';

const store = configureStore({}, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-right">
          <a className="pt-button pt-minimal pt-icon-people" href="/">Groups</a>
          <a className="pt-button pt-minimal pt-icon-align-justify" href="/messages">Messages</a>
        </div>
      </nav>
      <div className="su-page">
        <Router history={history}>
          <Route path="/" component={Groups}/>
          <Route path="/messages" component={Messages}/>
        </Router>
      </div>
    </div>
  </Provider>,
  document.getElementById('root')
);

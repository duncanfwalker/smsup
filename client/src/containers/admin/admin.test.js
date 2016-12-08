import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './admin';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const mockStore = {
    getState: ()=> ({groups:{ data: []}}),
    dispatch: ()=> {},
    subscribe: ()=> {},
  };
  ReactDOM.render(<Admin store={mockStore} />, div);
});

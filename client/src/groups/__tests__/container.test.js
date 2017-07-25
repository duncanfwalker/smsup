import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Container from '../container';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const mockStore = {
    getState: ()=> ({groups:{ data: []}}),
    dispatch: ()=> {},
    subscribe: ()=> {},
  };
  ReactDOM.render(<Container store={mockStore} />, div);
});

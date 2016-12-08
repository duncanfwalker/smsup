import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createReducer from './reducers';
import thunk from "redux-thunk";

export default function configureStore(initialState = {}, history) {
  const middlewares = [routerMiddleware(history),thunk];

  const enhancers = [applyMiddleware(...middlewares)];

//noinspection JSUnresolvedVariable
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;


  return createStore(createReducer(), initialState, composeEnhancers(...enhancers));
}

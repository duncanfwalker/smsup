import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import rest from "./api"; //our redux-rest object

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    ...rest.reducers
  })
}



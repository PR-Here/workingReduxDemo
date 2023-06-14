// store/reducers.js
import { combineReducers } from 'redux';
import apiReducer from '../slice/ProductSlice';

const rootReducer = combineReducers({
  api: apiReducer,
});

export default rootReducer;

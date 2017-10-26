import { combineReducers } from 'redux';
import * as bluetoothReducer from './bluetoothStuff'

export default combineReducers(Object.assign(
  bluetoothReducer,
))

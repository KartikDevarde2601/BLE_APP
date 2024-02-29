import {combineReducers} from '@reduxjs/toolkit';
import bluetoothReducer from './slices/bluetoothSlice';

const rootReducer = combineReducers({
  bluetooth: bluetoothReducer,
});

export default rootReducer;

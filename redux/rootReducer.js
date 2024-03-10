import {combineReducers} from '@reduxjs/toolkit';
import bluetoothReducer from './slices/bluetoothSlice';
import DataSlice from './slices/DataSlice';
import nurseSlice from './slices/nurseSlice';

const rootReducer = combineReducers({
  bluetooth: bluetoothReducer,
  data: DataSlice,
  nurse: nurseSlice,
});

export default rootReducer;

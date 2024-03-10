import {createSlice} from '@reduxjs/toolkit';

export const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    DeviceID: null,
    DeviceName: '',
    isDeviceConnected: false,
    connectionStatus: '',
    collecting: false,
    settingBelt: false,
  },
  reducers: {
    setDeviceID: (state, action) => {
      state.DeviceID = action.payload;
    },
    setDeviceName: (state, action) => {
      state.DeviceName = action.payload;
    },
    setDeviceConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    setDeviceConnection: (state, action) => {
      state.isDeviceConnected = action.payload;
    },
    setCollecting: (state, action) => {
      state.collecting = action.payload;
    },
    setsettingBelt: (state, action) => {
      state.settingBelt = action.payload;
    },
  },
});

export const {
  setDeviceID,
  setDeviceName,
  setDeviceConnectionStatus,
  setDeviceConnection,
  setCollecting,
  setsettingBelt,
} = bluetoothSlice.actions;

export default bluetoothSlice.reducer;

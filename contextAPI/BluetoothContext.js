// BluetoothContext.js

import React, {createContext, useContext, useReducer, useEffect} from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

const BluetoothContext = createContext();

const initialState = {
  devices: null,
  selectedDevice: null,
  isEnabled: false,
  isLoading: false,
  isError: false,
};

const bluetoothReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLUETOOTH_ENABLED':
      return {...state, isEnabled: action.payload};
    case 'FETCH_DEVICES_START':
      return {...state, isLoading: true};
    case 'FETCH_DEVICES_SUCCESS':
      const uniqueDevices = state.devices
        ? state.devices
            .concat(action.payload)
            .filter(
              (device, index, self) =>
                index === self.findIndex(d => d.id === device.id),
            )
        : action.payload;
      return {...state, isLoading: false, devices: uniqueDevices};
    case 'FETCH_DEVICES_ERROR':
      console.log('pairDeviceError', action.payload);
      return {...state, isLoading: false, isError: true};
    case 'SET_SELECTED_DEVICE':
      return {...state, selectedDevice: action.payload};
    default:
      return state;
  }
};

const BluetoothProvider = ({children}) => {
  const [state, dispatch] = useReducer(bluetoothReducer, initialState);

  const fetchPairedDevices = async () => {
    try {
      dispatch({type: 'FETCH_DEVICES_START'});
      const devices = await RNBluetoothClassic.getBondedDevices();
      dispatch({type: 'FETCH_DEVICES_SUCCESS', payload: devices});
    } catch (error) {
      dispatch({type: 'FETCH_DEVICES_ERROR', payload: error});
    }
  };

  const value = {state, dispatch, fetchPairedDevices};

  useEffect(() => {
    const checkBluetoothEnabled = async () => {
      try {
        const isEnabled = await RNBluetoothClassic.isBluetoothEnabled();
        if (isEnabled) {
          fetchPairedDevices();
          dispatch({type: 'SET_BLUETOOTH_ENABLED', payload: isEnabled});
        } else {
          const requstEnable =
            await RNBluetoothClassic.requestBluetoothEnabled();
          if (requstEnable) {
            fetchPairedDevices();
            dispatch({type: 'SET_BLUETOOTH_ENABLED', payload: requstEnable});
          }
        }
      } catch (error) {
        console.log('checkBluetoothEnabled', error);
      }
    };

    checkBluetoothEnabled();
  }, []);

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export {BluetoothProvider, useBluetooth};

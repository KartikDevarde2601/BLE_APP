import React from 'react';
import {useEffect} from 'react';
import MainNavigation from './navigations/main.Navigation';
import {NavigationContainer} from '@react-navigation/native';
import {BluetoothProvider} from './contextAPI/BluetoothContext';
import {CommunicationProvider} from './contextAPI/CommunicationContext';
import {BLEService} from './services/BLEservices';
import {Provider} from 'react-redux';
import store from './redux/store';

export default function App() {
  useEffect(() => {
    BLEService.initializeBLE();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  );
}

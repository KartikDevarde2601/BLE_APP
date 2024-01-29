import React from 'react';
import {useEffect} from 'react';
import MainNavigation from './navigations/main.Navigation';
import {NavigationContainer} from '@react-navigation/native';
import {BluetoothProvider} from './contextAPI/BluetoothContext';
import {CommunicationProvider} from './contextAPI/CommunicationContext';
import {BLEService} from './services/BLEservices';

export default function App() {
  useEffect(() => {
    BLEService.initializeBLE();
  }, []);

  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

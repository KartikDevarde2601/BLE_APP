import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMicrochip} from '@fortawesome/free-solid-svg-icons/faMicrochip';
import {faHeadset} from '@fortawesome/free-solid-svg-icons/faHeadset';

import {useBluetooth} from '../contextAPI/BluetoothContext';

const ConnectionScreen = ({navigation}) => {
  const {state, dispatch, fetchPairedDevices} = useBluetooth();

  const selectdevice = item => {
    dispatch({type: 'SET_SELECTED_DEVICE', payload: item});
    navigation.navigate('userlist');
  };

  const RenderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => selectdevice(item)}>
        <View style={styles.Itemcontainer}>
          <View style={styles.icon}>
            {item.deviceClass.majorClass === 1024 ? (
              <FontAwesomeIcon icon={faHeadset} size={25} color="#808080" />
            ) : (
              <FontAwesomeIcon icon={faMicrochip} size={25} color="#808080" />
            )}
          </View>
          <View style={styles.deviceNameWrap}>
            <Text style={styles.deviceName}>
              {item.name ? item.name : item.id}
            </Text>
            <Text style={styles.deviceAddress}>{item.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const startScanning = async () => {
    try {
      dispatch({type: 'FETCH_DEVICES_START'});
      const devices = await RNBluetoothClassic.getBondedDevices();
      dispatch({type: 'FETCH_DEVICES_SUCCESS', payload: devices});
      console.log(`discovered ${devices}`);
    } catch (error) {
      dispatch({type: 'FETCH_DEVICES_ERROR', payload: error});
    } finally {
      await RNBluetoothClassic.cancelDiscovery();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.textContainar}>
          <Text style={styles.Text}>Connected To Device</Text>
          <TouchableOpacity
            onPress={() => {
              startScanning();
            }}>
            <Text style={styles.ScanText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {state.isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : state.isError ? (
            <Text style={{fontSize: 20, color: 'blue'}}>Error occurred</Text>
          ) : (
            state.devices && (
              <FlatList
                style={{flex: 1}}
                data={state.devices}
                keyExtractor={item => item.id}
                renderItem={RenderItem}
              />
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textContainar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  Text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  ScanText: {
    fontSize: 20,
    fontWeight: '400',
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  icon: {
    margin: 10,
    marginRight: 10,
  },
  Itemcontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  deviceNameWrap: {
    flex: 1,
    flexDirection: 'column',
    margin: 10,
  },
  deviceName: {
    fontSize: 18,
    color: 'black',
  },
  deviceAddress: {
    fontSize: 14,
    color: 'grey',
  },
});

export default ConnectionScreen;

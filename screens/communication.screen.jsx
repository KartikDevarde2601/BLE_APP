import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {atob, btoa} from 'react-native-quick-base64';
import {faBluetooth} from '@fortawesome/free-brands-svg-icons/faBluetooth';
import {combinations} from '../utils/communicationUtils';
import {BleManager} from 'react-native-ble-plx';
const bleManager = new BleManager();

const CommunicationScreen = ({route}) => {
  const user = route && route.params ? route.params.user : null;

  const [deviceID, setDeviceID] = useState(null);
  const [onData, setOnData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Searching...');
  const [isdeviceconnected, setIsDeviceConnected] = useState(false);

  const startFreqRef = useRef(0);
  const endFreqRef = useRef(0);
  const stepsRef = useRef(0);
  const dataPointsRef = useRef(0);
  const collecting = useRef(false);

  const deviceRef = useRef(null);
  const commadcharacteristicRef = useRef(null);

  const SERVICE_UUID_SENSOR = '9b3333b4-8307-471b-95d1-17fa46507379';
  const CHARACTERISTIC_UUID_BIZA = 'a420b5f0-43d0-442b-bd01-8fa42172fb67';
  const CHARACTERISTIC_UUID_PHSA = '728c78e4-ed4c-4c06-abe3-c2c4d365f7c3';
  const CHARACTERISTIC_UUID_COMMAND = 'ea8145ec-d810-471a-877e-177ce5841b63';
  const CHARACTERRISTIC_UUID_CONTROL = 'e344743b-a3c0-4bc3-9449-9ef1eb2f8355';

  const searchAndConnectToDevice = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setConnectionStatus('Error searching for devices');
        return;
      }
      if (device.name === 'IHUBDATA') {
        bleManager.stopDeviceScan();
        setConnectionStatus('Connecting...');
        connectToDevice(device);
      }
    });
  };

  useEffect(() => {
    searchAndConnectToDevice();

    return () => {
      if (deviceRef.current) {
        deviceRef.current.cancelConnection();
        console.log('Disconnected on component unmount');
      }
    };
  }, []);

  useEffect(() => {
    const subscription = bleManager.onDeviceDisconnected(
      deviceID,
      (error, device) => {
        if (error) {
          console.log('Disconnected with error:', error);
        }
        setConnectionStatus('Disconnected');
        setIsDeviceConnected(false);
        console.log('Disconnected device');
        if (deviceRef.current) {
          setConnectionStatus('Reconnecting...');
          connectToDevice(deviceRef.current)
            .then(() => {
              setConnectionStatus('Connected');
              setIsDeviceConnected(true);
            })
            .catch(error => {
              console.log('Reconnection failed: ', error);
              setConnectionStatus('Reconnection failed');
            });
        }
      },
    );
    return () => subscription.remove();
  }, [deviceID]);

  const connectToDevice = device => {
    return device
      .connect()
      .then(device => {
        console.log(`device connected: ${device.id}`);
        setDeviceID(device.id);
        setConnectionStatus('Connected');
        setIsDeviceConnected(true);
        deviceRef.current = device;
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        return device.services();
      })
      .then(services => {
        let service = services.find(
          service => service.uuid === SERVICE_UUID_SENSOR,
        );
        return service.characteristics();
      })
      .then(characteristics => {
        const char1 = characteristics.find(
          char => char.uuid === CHARACTERISTIC_UUID_BIZA,
        );
        const char2 = characteristics.find(
          char => char.uuid === CHARACTERISTIC_UUID_PHSA,
        );
        const char3 = characteristics.find(
          char => char.uuid === CHARACTERRISTIC_UUID_CONTROL,
        );
        const char4 = characteristics.find(
          char => char.uuid === CHARACTERISTIC_UUID_COMMAND,
        );

        commadcharacteristicRef.current = char4;

        if (!char1 || !char2 || !char3) {
          throw new Error('One or more characteristics not found');
        }

        // Monitor char1 first
        char1.monitor((error, char) => {
          if (error) {
            console.error(error);
          } else {
            const char1Data = atob(char.value);
            console.log('Received data from characteristic 1:', char1Data);
            // Handle data from char1 as needed
          }
        });

        // Monitor char2 after char1
        char2.monitor((error, char) => {
          if (error) {
            console.error(error);
          } else {
            const char2Data = atob(char.value);
            console.log('Received data from characteristic 2:', char2Data);
            // Handle data from char2 as needed
          }
        });

        return char3;
      })
      .then(char3 => {
        char3.monitor((error, char) => {
          if (error) {
            console.error(error);
          } else {
            const char3Data = atob(char.value);
            console.log('Received data from characteristic 3:', char3Data);
            // Perform actions based on the received data from char3
          }
        });
      })
      .catch(error => {
        console.log(error);
        setConnectionStatus('Error in Connection');
      });
  };

  const writeDataToDevice = async data => {
    if (deviceRef.current && commadcharacteristicRef.current) {
      try {
        // Convert your data to base64 using btoa
        const encodedData = btoa(data);

        // Write the data to the characteristic
        await commadcharacteristicRef.current.writeWithResponse(encodedData);

        console.log('Data written successfully');
      } catch (error) {
        console.error('Error writing data:', error);
      }
    } else {
      console.error('Device or characteristic not available');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>Ihub-Data</Text>
        <View style={styles.BluetoothContainer}>
          <FontAwesomeIcon
            icon={faBluetooth}
            color={isdeviceconnected ? 'green' : 'red'}
            size={25}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Text style={{fontSize: 20, color: '#fa5043'}}>Data Transmission</Text>
        {onData.map((item, index) => (
          <View key={index} style={styles.logContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.logText}>
              {`${item.type} : ${item.data}`}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View>
        <Text>{connectionStatus}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              startFreqRef.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Starting Freq:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              endFreqRef.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Ending Freq:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              stepsRef.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Steps:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              dataPointsRef.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>DataPoints:</Text>
        </View>
      </View>

      <Button
        disabled={collecting.current}
        title="Start"
        color="#fa5043"
        onPress={() => writeDataToDevice('SET')}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputSubcontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleText: {
    fontSize: 12,
    fontWeight: 400,
    color: '#333',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  BluetoothContainer: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  input: {
    height: 50,
    width: 80,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  logContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 1,
  },
  logText: {
    flex: 1,
  },
});

export default CommunicationScreen;

import React, {useEffect, useRef, useState} from 'react';
import CustomAlert from '../components/customAlert';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {atob, btoa} from 'react-native-quick-base64';
import {faBluetooth} from '@fortawesome/free-brands-svg-icons/faBluetooth';
import {combinations} from '../utils/communicationUtils';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const bleManager = new BleManager();

const CommunicationScreen = ({route}) => {
  const user = route && route.params ? route.params.user : null;

  const [deviceID, setDeviceID] = useState(null);
  const [onData, setOnData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Searching...');
  const [isdeviceconnected, setisdeviceconnected] = useState(false);
  const [collecting, setCollecting] = useState(false);

  const ReadingDataRef = useRef(false);
  const startFreqRef = useRef(0);
  const endFreqRef = useRef(0);
  const stepsRef = useRef(0);
  const dataPointsRef = useRef(0);
  const index = useRef(0);

  const deviceRef = useRef(null);
  const commadcharacteristicRef = useRef(null);
  const InterruptcharacteristicRef = useRef(null);

  const SERVICE_UUID_SENSOR = '9b3333b4-8307-471b-95d1-17fa46507379';
  const CHARACTERISTIC_SENSOR_DATA = 'a420b5f0-43d0-442b-bd01-8fa42172fb67';
  const CHARACTERISTIC_UUID_COMMAND = 'ea8145ec-d810-471a-877e-177ce5841b63';
  const CHARACTERRISTIC_UUID_CONTROL = 'e344743b-a3c0-4bc3-9449-9ef1eb2f8355';
  const CHARACTERISTIC_UUID_INTERRUPT = '9bcec788-0cba-4437-b3b0-b53f0ee37312';

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
        setisdeviceconnected(false);
        ReadingDataRef.current = false;
        console.log('Disconnected device');
        if (deviceRef.current) {
          setConnectionStatus('Reconnecting...');
          connectToDevice(deviceRef.current)
            .then(() => {
              setConnectionStatus('Reconnected to IHUNDATA');
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

  const onPressStart = () => {
    if (
      !startFreqRef.current ||
      !endFreqRef.current ||
      !stepsRef.current ||
      !dataPointsRef.current
    ) {
      Alert('Please fill all the fields');
      CustomAlert({type: 'error', message: 'Please fill all the fields'});
      return;
    }
    ReadingDataRef.current = true;
    setCollecting(prevState => {
      return !prevState;
    });
    setConnectionStatus('Collecting Data.....');
    writeDataToDevice();
  };

  const writeDataToDevice = async () => {
    if (
      deviceRef.current &&
      commadcharacteristicRef.current &&
      ReadingDataRef.current
    ) {
      if (
        index.current == combinations.length &&
        startFreqRef.current < endFreqRef.current
      ) {
        startFreqRef.current =
          Number(startFreqRef.current) + Number(stepsRef.current);
        index.current = 0;
      }

      if (
        index.current == combinations.length &&
        startFreqRef.current == endFreqRef.current
      ) {
        setCollecting(prevState => {
          return !prevState;
        });
        setConnectionStatus('all Data is been collected');
        console.log('All combination Completed');
        return;
      }

      let currentCombination = combinations[index.current];

      let firstNumber = currentCombination[0];
      let secondNumber = currentCombination[1];

      let dataArray = [
        Number(startFreqRef.current),
        Number(dataPointsRef.current),
        Number(firstNumber),
        Number(secondNumber),
      ];
      // Convert array to Uint8Array
      const dataBuffer = new Uint8Array(dataArray);
      // Convert Uint8Array to base64
      let base64Data = btoa(String.fromCharCode.apply(null, dataBuffer));

      console.log('data to Buffer.....');
      try {
        // Write the data to the characteristic
        await commadcharacteristicRef.current.writeWithResponse(base64Data);

        console.log('Data written successfully');
      } catch (error) {
        console.error('Error writing data:', error);
      }
    } else {
      console.error('Device or characteristic not available');
    }
  };

  const connectToDevice = device => {
    return device
      .connect()
      .then(device => {
        console.log(`device connected: ${device.id}`);
        setDeviceID(device.id);
        setConnectionStatus('Connected');
        setisdeviceconnected(true);
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
          char => char.uuid === CHARACTERISTIC_SENSOR_DATA,
        );
        const char2 = characteristics.find(
          char => char.uuid === CHARACTERISTIC_UUID_INTERRUPT,
        );
        const char3 = characteristics.find(
          char => char.uuid === CHARACTERRISTIC_UUID_CONTROL,
        );
        const char4 = characteristics.find(
          char => char.uuid === CHARACTERISTIC_UUID_COMMAND,
        );

        commadcharacteristicRef.current = char4;
        InterruptcharacteristicRef.current = char2;

        if (!char1 || !char3) {
          throw new Error('One or more characteristics not found');
        }

        // Monitor char1 first
        char1.monitor((error, char) => {
          if (error) {
            console.error(error);
          } else {
            // Convert base64-encoded data to binary
            const binaryString = base64.decode(char.value);

            // Create a buffer from the binary string
            let buffer = new ArrayBuffer(binaryString.length);
            let view = new Uint8Array(buffer);

            for (let i = 0; i < binaryString.length; i++) {
              view[i] = binaryString.charCodeAt(i);
            }

            // Now buffer is an ArrayBuffer. Pass it to the DataView constructor
            const dataView = new DataView(buffer);

            const bioImpedance = dataView.getFloat64(0, true); // true for little-endian
            const phaseAngle = dataView.getFloat64(8, true); // Assuming each double is 8 bytes

            // Now you can work with bioImpedance and phaseAngle
            console.log('Received bioImpedance:', bioImpedance);
            console.log('Received phaseAngle:', phaseAngle);

            setOnData(prevState => {
              return [
                ...prevState,
                {type: 'Bio Impedance', data: bioImpedance},
                {type: 'Phase Angle', data: phaseAngle},
              ];
            });
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
            if (char3Data === 'NEXT') {
              index.current = index.current + 1;
              writeDataToDevice();
            }
          }
        });
      })
      .catch(error => {
        console.log(error);
        setConnectionStatus('Error in Connection');
      });
  };

  onPressInterrupt = async () => {
    setCollecting(prevState => {
      return !prevState;
    });
    ReadingDataRef.current = false;
    setConnectionStatus('Data Collection Interrupted');
    try {
      await InterruptcharacteristicRef.current.writeWithResponse('STOPPED');
    } catch (error) {
      console.error('Error writing data:', error);
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

      <View style={styles.buttoncontainer}>
        <View style={styles.button}>
          <Button
            disabled={collecting || !isdeviceconnected}
            title="Start"
            color="#fa5043"
            onPress={() => onPressStart()}
          />
        </View>
        <View style={styles.button}>
          <Button
            disabled={!collecting}
            title="Stop"
            color="#fa5043"
            onPress={() => onPressInterrupt()}
          />
        </View>
      </View>
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
  buttoncontainer: {
    flexDirection: 'row', // Set the direction to horizontal
    justifyContent: 'space-between', // Space between the buttons
    padding: 10, // Optional padding for better aesthetics
  },
  button: {
    flex: 1, // Take up all available space
    margin: 5, // Optional margin for better aesthetics
  },
});

export default CommunicationScreen;

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {atob, btoa} from 'react-native-quick-base64';
import {faBluetooth} from '@fortawesome/free-brands-svg-icons/faBluetooth';
import GraphScreen from '../components/graph';
import SettingBelt from '../components/settingbelt';
import {
  base64ToArrayBuffer_ESP,
  base64ToArrayBuffer_Ardiuno,
} from '../utils/decodingData';
import {
  combinations,
  SERVICE_UUID_SENSOR,
  CHARACTERISTIC_SENSOR_DATA,
  CHARACTERISTIC_UUID_COMMAND,
  CHARACTERRISTIC_UUID_CONTROL,
  CHARACTERISTIC_UUID_INTERRUPT,
} from '../utils/communicationUtils';
import {BLEService} from '../services/BLEservices';
import {useSelector, useDispatch} from 'react-redux';
import {
  setDeviceID,
  setDeviceConnectionStatus,
  setDeviceConnection,
  setCollecting,
  setsettingBelt,
} from '../redux/slices/bluetoothSlice';
import {
  setgraphdata,
  setdata,
  setAllGraphData,
} from '../redux/slices/DataSlice';

const CommunicationScreen = ({route}) => {
  const dispatch = useDispatch();

  const readingData = useRef(false);
  const startFreq = useRef(0);
  const endFreq = useRef(0);
  const steps = useRef(0);
  const dataPoints = useRef(0);
  const index = useRef(0);

  const {
    DeviceID,
    DeviceName,
    isDeviceConnected,
    connectionStatus,
    collecting,
    settingBelt,
  } = useSelector(state => state.bluetooth);

  useEffect(() => {
    const setupDevice = async () => {
      BLEService.searchAndConnectToDevice('IHUBDATA');
    };

    setupDevice();

    return () => {
      BLEService.disconnectDevice();
    };
  }, []);

  useEffect(() => {
    if (isDeviceConnected) {
      console.log('setting Monitoring');
      setMonitoringCharacteristicsSensorData();
      setupMonitorCharateristicControlCommand();
    }
  }, [isDeviceConnected]);

  const setMonitoringCharacteristicsSensorData = () => {
    BLEService.monitorCharacteristic(
      SERVICE_UUID_SENSOR,
      CHARACTERISTIC_SENSOR_DATA,
      onCharacteristicChangeSensorData,
      onError,
    );
  };

  const setupMonitorCharateristicControlCommand = () => {
    BLEService.monitorCharacteristic(
      SERVICE_UUID_SENSOR,
      CHARACTERRISTIC_UUID_CONTROL,
      onCharacteristicControlChange,
      onError,
    );
  };

  const onError = async error => {
    console.log('Error:', error);
  };

  const gettime = () => {
    const date = new Date();
  };

  const prepareSensorData = data => {
    return data.map(item => ({
      frequency: startFreq.current,
      postGenerator: combinations[index.current][0],
      postSensor: combinations[index.current][1],
      bioimpedance: item.magnitude,
      phaseAngle: item.phase,
      stepSize: steps.current,
      numberOfDataPoints: dataPoints.current,
      timeseries: gettime(),
    }));
  };

  const onCharacteristicChangeSensorData = async value => {
    console.log('data Recived');
    const binaryString = atob(value);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataobject = [];
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < bytes.length; i += 16) {
      const magnitude = dataView.getFloat64(i, true);
      const phase = dataView.getFloat64(i + 8, true);
      dataobject.push({magnitude, phase});
    }
    console.log('Received data from characteristic:', dataobject);
    dispatch(setdata(prepareSensorData(dataobject)));
    dispatch(setgraphdata(dataobject));
  };

  const onCharacteristicControlChange = async value => {
    const ControlData = atob(value);
    console.log('Received data from Control characteristic:', ControlData);
    if (ControlData === 'NEXT') {
      index.current = index.current + 1;
      dispatch(setAllGraphData());
      await writeDataToDevice();
    }
  };

  const writeDataToDevice = async () => {
    if (DeviceID && readingData.current) {
      if (
        index.current == combinations.length &&
        startFreq.current < endFreq.current
      ) {
        startFreq.current = Number(startFreq.current) + Number(steps.current);
        index.current = 0;
      }

      if (
        index.current == combinations.length &&
        startFreq.current == endFreq.current
      ) {
        updateState({collecting: false});
        dispatch(setDeviceConnectionStatus('Data Collection Completed'));
        return;
      }

      let currentCombination = combinations[index.current];

      let firstNumber = currentCombination[0];
      let secondNumber = currentCombination[1];
      let dataArray = [
        Number(startFreq.current),
        Number(dataPoints.current),
        Number(firstNumber),
        Number(secondNumber),
      ];
      const dataBuffer = new Uint8Array(dataArray);
      let base64Data = btoa(String.fromCharCode.apply(null, dataBuffer));
      console.log('Data writing');
      BLEService.writeCharacteristicwithResponseForDevice(
        SERVICE_UUID_SENSOR,
        CHARACTERISTIC_UUID_COMMAND,
        base64Data,
      );
    }
  };

  const onPressStart = () => {
    if (!startFreq || !endFreq || !steps || !dataPoints) {
      Alert.alert('Please fill all the fields');
      return;
    }
    readingData.current = true;
    dispatch(setCollecting(true));
    dispatch(setDeviceConnectionStatus('Collecting Data.....'));
    writeDataToDevice();
  };

  const onPressInterrupt = async () => {
    readingData.current = false;
    dispatch(setCollecting(false));
    dispatch(setDeviceConnectionStatus('Data Collection Interrupted'));
    await BLEService.writeCharacteristicwithResponseForDevice(
      SERVICE_UUID_SENSOR,
      CHARACTERISTIC_UUID_INTERRUPT,
      'STOPPED',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>Ihub-Data</Text>
        <View style={styles.BluetoothContainer}>
          <FontAwesomeIcon
            icon={faBluetooth}
            color={isDeviceConnected ? 'green' : 'red'}
            size={25}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.GraphContainer}>
          {settingBelt ? <GraphScreen /> : <SettingBelt />}
        </View>
      </ScrollView>
      <View>
        <Text>{connectionStatus}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              startFreq.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Starting Freq:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              endFreq.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Ending Freq:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              steps.current = text;
            }}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.titleText}>Steps:</Text>
        </View>
        <View style={styles.inputSubcontainer}>
          <TextInput
            onChangeText={text => {
              dataPoints.current = text;
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
            disabled={collecting || !isDeviceConnected}
            title="Start"
            color="#fa5043"
            onPress={onPressStart}
          />
        </View>
        <View style={styles.button}>
          <Button
            disabled={!collecting}
            title="Stop"
            color="#fa5043"
            onPress={onPressInterrupt}
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
    fontWeight: '400',
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  GraphContainer: {
    flex: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    flex: 1,
    margin: 5,
  },
});

export default CommunicationScreen;

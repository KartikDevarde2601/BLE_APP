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
import {faBluetooth} from '@fortawesome/free-brands-svg-icons/faBluetooth';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

import {combinations} from '../utils/communicationUtils';

// Context API hooks
import {useBluetooth} from '../contextAPI/BluetoothContext';
import {useCommunication} from '../contextAPI/CommunicationContext';
import axios from 'axios';

const CommunicationScreen = ({navigation, route}) => {
  const user = route.params.user;

  const getvisitLength = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.100:4000/api/v1/visitlenght/659dbc76718cf4d3a3affd6c`,
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const {state, dispatch} = useBluetooth();
  const {state: communicationState, dispatch: communicationDispatch} =
    useCommunication();

  const startFreqRef = useRef(0);
  const endFreqRef = useRef(0);
  const stepsRef = useRef(0);
  const dataPointsRef = useRef(0);
  const index = useRef(0);
  const collecting = useRef(false);

  const [onData, setOnData] = useState([]);
  const [CompleteData, setCompleteData] = useState([]);

  let readSubscription = null;
  let disconnectSubscription = null;

  useEffect(() => {
    getvisitLength();
    setTimeout(() => connect(), 0);

    return () => disconnect(); // Cleanup on component unmount
  }, []);

  const connect = async () => {
    try {
      let connection = await state.selectedDevice.isConnected();
      console.log(
        `connected or Not to ${connection} ${state.selectedDevice.name}`,
      );
      if (!connection) {
        let connect = await state.selectedDevice.connect(
          communicationState.connectionOptions,
        );
        console.log(`connect:${connect} ${state.selectedDevice.name}`);
        communicationDispatch({type: 'SET_CONNECTED', payload: true});
      }
      initializeRead();
    } catch (error) {
      console.log(`connect error:${error}`);
    }
  };

  const initializeRead = () => {
    disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(
      () => disconnect(true),
      (collecting.current = false),
    );

    readSubscription = state.selectedDevice.onDataReceived(data =>
      onReceivedData(data.data),
    );
  };

  const disconnect = async disconnected => {
    try {
      if (!disconnected) {
        disconnected = await state.selectedDevice.disconnect();
        communicationDispatch({type: 'SET_CONNECTED', payload: false});
      }
    } catch (error) {
      console.log(`disconnect error:${error}`);
    }
    disconnectSubscription.remove();
    uninitializeRead();
  };

  const uninitializeRead = () => {
    if (readSubscription) {
      readSubscription.remove();
    }
  };

  const SetValueArdiuno = () => {
    if (collecting.current) {
      if (
        index.current == combinations.length &&
        startFreqRef.current < endFreqRef.current
      ) {
        startFreqRef.current =
          Number(startFreqRef.current) + Number(stepsRef.current);
        index.current = 0;
      }
      if (
        index == combinations.length &&
        startFreqRef.current === endFreqRef.current
      ) {
        collecting.current = false;
        console.log('All combination Completed');
      }
      let currentCombination = combinations[index.current];
      console.log(`currentCombination:${currentCombination}`);
      let firstNumber = currentCombination[0];
      let secondNumber = currentCombination[1];

      let SetCommand = `SET:${startFreqRef.current},${dataPointsRef.current},${firstNumber},${secondNumber}`;
      let sendCommand = SetCommand + '\n';
      let Commandstring = sendCommand.toString();
      sendData(Commandstring);
    }
  };

  const onReceivedData = data => {
    if (data.includes('100:CommandReceived:')) {
      console.log('Command Received');
      index.current = index.current + 1;
      console.log(`index:${index.current}`);
    } else if (data.includes('404:InvalidCommand')) {
      console.log('Invalid Command');
      SetValueArdiuno();
    } else if (data.includes('200:Complete')) {
      setCompleteData(prevCompleteData => [...prevCompleteData, onData]);
      console.log('Completed one combination');
      SetValueArdiuno();
    } else {
      setOnData(prevOnData => [
        ...prevOnData,
        {
          data: data,
          type: 'RECEIVED',
        },
      ]);
    }
  };

  const sendData = async Command => {
    console.log(`Command:${Command}`);
    await state.selectedDevice.write(Command);
  };

  const onPressStart = () => {
    collecting.current = true;
    SetValueArdiuno();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>Ihub-Data</Text>
        <View style={styles.BluetoothContainer}>
          <FontAwesomeIcon
            icon={faBluetooth}
            color={communicationState.connected ? 'green' : 'red'}
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
        onPress={() => onPressStart()}
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

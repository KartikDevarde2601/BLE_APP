import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {setsettingBelt} from '../redux/slices/bluetoothSlice';

const SettingBelt = () => {
  const [chestValue, setChestValue] = useState('');
  const dispatch = useDispatch();

  const calculateElectrodePositions = () => {
    const RR = chestValue === '' ? 0 : chestValue / 4;
    const LL = chestValue === '' ? 0 : RR + chestValue / 2;
    const FR = chestValue === '' ? 0 : Math.round(RR * (5 / 8));
    const BR = chestValue === '' ? 0 : Math.round(RR * (8 / 5));
    const BL = chestValue === '' ? 0 : Math.round(LL * (7 / 8));
    const FL = chestValue === '' ? 0 : Math.round(LL * (8 / 7));

    return {RR, LL, FR, BR, BL, FL};
  };

  const handleOK = () => {
    console.log('OK');
    dispatch(setsettingBelt(true));
  };

  const {RR, LL, FR, BR, BL, FL} = calculateElectrodePositions();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Setting Belt on Body</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Chest Value"
          keyboardType="numeric"
          placeholderTextColor="#888"
          onChangeText={text => setChestValue(text)}
        />
      </View>
      <View style={styles.electrodeContainer}>
        <Text style={[styles.electrodeText, styles.boldText]}>
          RR :: Right current injecting electrode = {RR}
        </Text>
        <Text style={[styles.electrodeText, styles.boldText]}>
          LL :: Left current injecting electrode = {LL}
        </Text>
        <Text style={[styles.electrodeText, styles.boldText]}>
          FR :: Front right electrode set = {FR}
        </Text>
        <Text style={[styles.electrodeText, styles.boldText]}>
          BR :: Back right electrode set = {BR}
        </Text>
        <Text style={[styles.electrodeText, styles.boldText]}>
          BL :: Back left electrode set = {BL}
        </Text>
        <Text style={[styles.electrodeText, styles.boldText]}>
          FL :: Front left electrode set = {FL}
        </Text>
      </View>
      <View style={styles.okButtonContainer}>
        <Text style={[styles.okButtonText, styles.boldText]}>
          Set Belt on Patient Body. Click Done when ready.
        </Text>
        <Button onPress={handleOK} title="belt done" style={styles.okButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40, // Reduced height
  },
  electrodeContainer: {
    marginTop: 20,
  },
  electrodeText: {
    marginBottom: 5,
    fontSize: 16,
  },
  okButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  okButtonText: {
    marginBottom: 10,
    fontSize: 18, // Increased font size
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue', // Adjust button background color
    borderRadius: 5,
  },
  okButton: {
    backgroundColor: 'green', // Adjust OK button background color
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default SettingBelt;

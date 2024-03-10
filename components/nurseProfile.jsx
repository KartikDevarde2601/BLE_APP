import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const name = 'Pallavi Patil';
const doctorName = 'Omkar Patil';
const nurseID = 'N001';

const NurseProfile = () => {
  const photo = require('../assets/nurse.png');
  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <Image source={photo} style={styles.photo} />
      </View>
      <View style={styles.rightSide}>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Nurse Name:</Text>
          <Text style={styles.content}>{name}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Doctor Name:</Text>
          <Text style={styles.content}>{doctorName}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>NurseID:</Text>
          <Text style={styles.content}>{nurseID}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  leftSide: {
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    flex: 3,
    justifyContent: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
    marginRight: 5,
  },
  content: {
    fontSize: 18,
    color: '#333',
  },
});

export default NurseProfile;

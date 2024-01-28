import React from 'react';
import {useEffect} from 'react';
import USERDATA from '../utils/userlistData';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const selectUser = (item, navigation) => {
  console.log(`user selected ${item.name}`);
  navigation.navigate('communication', {user: item});
};

const RenderItem = ({item, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => selectUser(item, navigation)}
      style={styles.itemContainer}>
      <View style={styles.userIcon}>
        <FontAwesomeIcon icon={faUser} size={30} color="#203563" />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Patient ID: <Text style={styles.value}>{item._id}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{item.age}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{item.gender}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const UserListScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>Patient List</Text>
        <View style={styles.logContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('newUser')}>
            <FontAwesomeIcon icon={faPlus} size={25} color="#203563" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.flatList}
        data={USERDATA}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <RenderItem item={item} navigation={navigation} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logContainer: {
    borderRadius: 50,
    backgroundColor: 'lightblue',
    padding: 4,
  },
  flatList: {
    flex: 1,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'lightblue',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#203563',
  },
  value: {
    fontSize: 16,
    color: '#203563',
  },
});

export default UserListScreen;

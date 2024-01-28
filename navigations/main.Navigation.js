import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Import your screen components
import ConnectionScreen from '../screens/connectToDevice.screen';
import CommunicationScreen from '../screens/communication.screen';
import UserListScreen from '../screens/userlist.screen';
import MyForm from '../screens/addNewUser.screen';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="connection">
      <Stack.Screen
        name="connection"
        component={ConnectionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="communication"
        component={CommunicationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="userlist"
        component={UserListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="newUser"
        component={MyForm}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

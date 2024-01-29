import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Import your screen components
import CommunicationScreen from '../screens/communication.screen';
import UserListScreen from '../screens/userlist.screen';
import MyForm from '../screens/addNewUser.screen';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="UserListScreen">
      <Stack.Screen
        name="userlist"
        component={UserListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="communication"
        component={CommunicationScreen}
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

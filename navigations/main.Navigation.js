import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Import your screen components
import CommunicationScreen from '../screens/communication.screen';
import UserListScreen from '../screens/userlist.screen';
import MyForm from '../screens/addNewUser.screen';
import LoginScreen from '../screens/login.screen';
import AddNewNurse from '../screens/addNewNurse.screen';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="newNurse"
        component={AddNewNurse}
        options={{headerShown: false}}
      />
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

import React from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>IHUB-DATA</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={async values => {
          console.log(values);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#888"
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button onPress={handleSubmit} title="Submit" color="#841584" />
          </View>
        )}
      </Formik>
      <View>
        <View style={styles.registerContainer}>
          <Text style={styles.register}>don't have account </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('newNurse');
            }}>
            <Text style={styles.click}>click here</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  register: {
    color: 'blue',
    fontSize: 16,
  },
  click: {
    color: 'red',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for the entire screen
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Text color for the logo
  },
  input: {
    width: 300,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Background color for input fields
    color: '#333', // Text color for input fields
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default LoginScreen;

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {database} from '../database';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  doctorID: Yup.string().required('Doctor ID is required'),
  doctorName: Yup.string().required('Doctor Name is required'),
  password: Yup.string().required('Password is required'),
});

const AddNewNurse = ({navigation}) => {
  const dispatch = useDispatch();

  const handleSubmit = async values => {
    await database.write(async () => {
      const NewNurse = await database.get('nurses').create(nurse => {
        nurse.name = values.name;
        nurse.email = values.email;
        nurse.role = values.role;
        nurse.doctorId = values.doctorID;
        nurse.doctorName = values.doctorName;
      });
      console.log('New Nurse:', NewNurse);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>Create New Nurse Account</Text>
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            role: '',
            doctorID: '',
            doctorName: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
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
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                style={styles.input}
              />
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <TextInput
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <TextInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                style={styles.input}
                secureTextEntry
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <TextInput
                placeholder="Role"
                onChangeText={handleChange('role')}
                onBlur={handleBlur('role')}
                value={values.role}
                style={styles.input}
              />
              {errors.role && touched.role && (
                <Text style={styles.error}>{errors.role}</Text>
              )}

              <TextInput
                placeholder="Doctor ID"
                onChangeText={handleChange('doctorID')}
                onBlur={handleBlur('doctorID')}
                value={values.doctorID}
                style={styles.input}
              />
              {errors.doctorID && touched.doctorID && (
                <Text style={styles.error}>{errors.doctorID}</Text>
              )}

              <TextInput
                placeholder="Doctor Name"
                onChangeText={handleChange('doctorName')}
                onBlur={handleBlur('doctorName')}
                value={values.doctorName}
                style={styles.input}
              />
              {errors.doctorName && touched.doctorName && (
                <Text style={styles.error}>{errors.doctorName}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create Nurse</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddNewNurse;

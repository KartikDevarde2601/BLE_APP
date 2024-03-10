import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import userValidationSchema from '../utils/formvalidation';
import {ScrollView} from 'react-native-gesture-handler';
import {
  genderOptions,
  bloodGroupOptions,
  calculateBMI,
  colors,
} from '../utils/formUtils';

const MyForm = () => {
  const initialValues = {
    name: '',
    age: '',
    gender: '',
    race: '',
    height: '',
    weight: '',
    BMI: '',
    bloodGroup: '',
    email: '',
    password: '',
    comorbidities: {
      diabetes: false,
      HTN: false,
      asthma: false,
      smoking: false,
      alcoholUse: false,
      kindneyDisease: false,
      pastMI: false,
      pastCVA: false,
      priorStenting: false,
      priorCABG: false,
    },
    medicationHistory: {
      diuretics: false,
    },
  };

  const handleSubmit = values => {
    const {
      comorbidities,
      medicationHistory,
      IBM,
      name,
      email,
      bloodGroup,
      gender,
      password,
      race,
      weight,
      age,
      height,
    } = values;

    const patientData = {
      name,
      age,
      IBM,
      email,
      bloodGroup,
      gender,
      password,
      race,
      weight,
      height,
    };
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                value={values.name}
                placeholder="Name"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange('age')}
                value={values.age}
                placeholder="Age"
              />
              {touched.age && errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
              <Picker
                selectedValue={values.gender}
                onValueChange={itemValue => handleChange('gender')(itemValue)}>
                <Picker.Item label="Select Gender" value="" />
                {genderOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  handleChange('height')(text);
                  handleChange('BMI')(calculateBMI(values.weight, text));
                }}
                value={values.height}
                placeholder="Height in cm"
              />
              {touched.height && errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  handleChange('weight')(text);
                  handleChange('BMI')(calculateBMI(text, values.height));
                }}
                value={values.weight}
                placeholder="Weight in  kg"
              />
              {touched.weight && errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange('BMI')}
                value={values.BMI}
                placeholder="BMI"
              />
              {touched.BMI && errors.BMI && (
                <Text style={styles.errorText}>{errors.BMI}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange('race')}
                value={values.race}
                placeholder="Race"
              />
              {touched.race && errors.race && (
                <Text style={styles.errorText}>{errors.race}</Text>
              )}
              {touched.gender && errors.gender && (
                <Text style={[styles.errorText, {color: 'red'}]}>
                  {errors.gender}
                </Text>
              )}
              <Picker
                selectedValue={values.bloodGroup}
                onValueChange={itemValue =>
                  handleChange('bloodGroup')(itemValue)
                }>
                <Picker.Item label="Select Blood Group" value="" />
                {bloodGroupOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              {touched.bloodGroup && errors.bloodGroup && (
                <Text style={[styles.errorText, {color: 'red'}]}>
                  {errors.bloodGroup}
                </Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={handleChange('password')}
                value={values.password}
                placeholder="Password"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                value={values.email}
                placeholder="Email"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>Diabetes</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.diabetes}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.diabetes',
                        !values.comorbidities.diabetes,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>HTN</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.HTN}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.diabetes',
                        !values.comorbidities.HTN,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
              </View>

              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>asthma</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.asthma}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.asthma',
                        !values.comorbidities.asthma,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>smoking</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.smoking}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.smoking',
                        !values.comorbidities.smoking,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
              </View>

              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>alcoholUse</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.alcoholUse}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.alcoholUse',
                        !values.comorbidities.alcoholUse,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>kindneyDisease</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.kindneyDisease}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.kindneyDisease',
                        !values.comorbidities.kindneyDisease,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
              </View>

              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>pastMI</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.pastMI}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.pastMI',
                        !values.comorbidities.pastMI,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>pastCVA</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.pastCVA}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.pastCVA',
                        !values.comorbidities.pastCVA,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
              </View>

              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>priorStenting</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.priorStenting}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.priorStenting',
                        !values.comorbidities.priorStenting,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>priorCABG</Text>
                  <BouncyCheckbox
                    isChecked={values.comorbidities.priorCABG}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.priorCABG',
                        !values.comorbidities.priorCABG,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
              </View>

              <View style={styles.CheckboxRow}>
                <View style={styles.CheckBoxcontainer}>
                  <Text style={styles.checkboxtest}>diuretics</Text>
                  <BouncyCheckbox
                    isChecked={values.medicationHistory.diuretics}
                    onPress={() => {
                      setFieldValue(
                        'comorbidities.priorStenting',
                        !values.medicationHistory.diuretics,
                      );
                    }}
                    fillColor="green"
                  />
                </View>
                <View style={styles.CheckBoxcontainer}></View>
              </View>

              <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: colors.darkGray,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    color: colors.darkGray,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  labelText: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    color: colors.darkGray,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.modernBlue,
    padding: 14,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  CheckboxRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  CheckBoxcontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxtest: {
    marginRight: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
});

export default MyForm;

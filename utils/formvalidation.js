import * as Yup from 'yup';

const userValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .min(0, 'Age must be greater than or equal to 0')
    .required('Age is required'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'])
    .required('Gender is required'),
  race: Yup.string().required('Race is required'),
  height: Yup.number().required('Height is required'),
  weight: Yup.number().required('Weight is required'),
  BMI: Yup.number().required('BMI is required'),
  bloodGroup: Yup.string().required('Blood Group is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  comorbidities: Yup.object().shape({
    diabetes: Yup.boolean(),
    HTN: Yup.boolean(),
    asthma: Yup.boolean(),
    smoking: Yup.boolean(),
    alcoholUse: Yup.boolean(),
    kidneyDisease: Yup.boolean(),
    pastMI: Yup.boolean(),
    pastCVA: Yup.boolean(),
    priorStenting: Yup.boolean(),
    priorCABG: Yup.boolean(),
  }),
  medicationHistory: Yup.object().shape({
    diuretics: Yup.boolean(),
  }),
});

export default userValidationSchema;

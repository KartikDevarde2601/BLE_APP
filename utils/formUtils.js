export const genderOptions = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Other', value: 'Other'},
];

export const bloodGroupOptions = [
  {label: 'A+', value: 'A+'},
  {label: 'A-', value: 'A-'},
  {label: 'B+', value: 'B+'},
  {label: 'B-', value: 'B-'},
  {label: 'AB+', value: 'AB+'},
  {label: 'AB-', value: 'AB-'},
  {label: 'O+', value: 'O+'},
  {label: 'O-', value: 'O-'},
];

export const calculateBMI = (weight, height) => {
  const numericWeight = parseFloat(weight);
  const numericHeight = parseFloat(height);

  if (!isNaN(numericWeight) && !isNaN(numericHeight) && numericHeight !== 0) {
    const bmi = (numericWeight / (numericHeight / 100) ** 2).toFixed(2);
    return bmi.toString();
  }

  return '';
};

export const colors = {
  modernBlue: '#3498db',
  lightGray: '#ecf0f1',
  darkGray: '#2c3e50',
};

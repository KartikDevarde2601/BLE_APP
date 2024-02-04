// CustomAlert.js
import React from 'react';
import Toast from 'react-native-toast-message';

const CustomAlert = ({type, message}) => {
  const showAlert = () => {
    Toast.show({
      type: type || 'info',
      position: 'bottom',
      text1: message || 'Alert Message',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  return <Toast ref={ref => Toast.setRef(ref)} />;
};

export default CustomAlert;

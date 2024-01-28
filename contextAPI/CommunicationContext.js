// CommunicationContext.js
import React, {useContext, useReducer} from 'react';

const initialState = {
  text: undefined,
  polling: false,
  connected: false,
  data: [],
  connectionOptions: {
    CONNECTOR_TYPE: 'rfcomm',
    DELIMITER: '\n',
    DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
  },
};

function communicationReducer(state, action) {
  switch (action.type) {
    case 'SET_TEXT':
      return {...state, text: action.payload};
    case 'SET_POLLING':
      return {...state, polling: action.payload};
    case 'SET_CONNECTED':
      return {...state, connected: action.payload};
    case 'SET_DATA':
      return {...state, data: action.payload};
    default:
      return state;
  }
}

const CommunicationContext = React.createContext();

const CommunicationProvider = ({children}) => {
  const [state, dispatch] = useReducer(communicationReducer, initialState);

  return (
    <CommunicationContext.Provider value={{state, dispatch}}>
      {children}
    </CommunicationContext.Provider>
  );
};

const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export {useCommunication, CommunicationProvider};

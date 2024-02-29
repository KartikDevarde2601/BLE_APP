import {
  BleError,
  BleErrorCode,
  BleManager,
  Device,
  State as BluetoothState,
  LogLevel,
  type Subscription,
  type UUID,
  type DeviceId,
  type Characteristic,
  type TransactionId,
  Base64,
} from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import  store  from '../redux/store';
import {setDeviceID,setDeviceName,setDeviceConnectionStatus, setDeviceConnection} from '../redux/slices/bluetoothSlice';



const deviceNotConnectedErrorText = 'Device not connected';

class BLEServiceInstance {
  manager: BleManager;
  device: Device | null;
  characteristicMonitor: Subscription | null;
  isCharacteristicMonitorDisconnectExpected: boolean;

  constructor() {
    this.device = null;
    this.characteristicMonitor = null;
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
    this.isCharacteristicMonitorDisconnectExpected = false;
  }

  getDevice = () => this.device;

  async initializeBLE() {
    return new Promise<void>(resolve => {
      const subscription = this.manager.onStateChange(state => {
        switch (state) {
          case BluetoothState.Unsupported:
            this.showErrorToast('');
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            this.manager.enable().catch((error: BleError) => {
              if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
                this.requestBluetoothPermission();
              }
            });
            break;
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            resolve();
            subscription.remove();
            break;
          default:
            console.error('Unsupported state: ', state);
        }
      }, true);
    });
  }

  getDeviceID(){
    return this.device?.id;
  }
   
  async requestBluetoothPermission() {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ]);
        return (
          result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }
    this.showErrorToast('Permission have not been granted');
    return false;
  }

  onBluetoothPowerOff() {
    this.showErrorToast('Bluetooth is turned off');
  }

  showErrorToast(message: string) {
    console.error(message);
  }

  connectToDevice = (deviceId: DeviceId) =>
    new Promise<Device>((resolve, reject) => {
      this.manager.stopDeviceScan()
      this.manager
        .connectToDevice(deviceId)
        .then(device => {
          device.requestMTU(251);
          this.updateDeviceConnectionStatus(`Connected to ${device.name}`)
          this.device = device
          this.discoverAllServicesAndCharacteristicsForDevice()
          resolve(device)
        })
        .catch(error => {
          if (error.errorCode === BleErrorCode.DeviceAlreadyConnected && this.device) {
            resolve(this.device)
          } else {
            this.onError(error)
            reject(error)
          }
        })
    })

    discoverAllServicesAndCharacteristicsForDevice = async () => {
      return new Promise<Device>((resolve, reject) => {
        if (!this.device) {
          this.showErrorToast(deviceNotConnectedErrorText);
          reject(new Error(deviceNotConnectedErrorText));
          return;
        }
        this.updateDeviceConnectionStatus('Discovering services and characteristics');
        this.manager
          .discoverAllServicesAndCharacteristicsForDevice(this.device.id)
          .then(device => {
            this.device = device;
            this.updateDeviceID(device.id);
            this.updateDeviceName(device.name);
            this.updateIsDeviceConnected(true);
            this.updateDeviceConnectionStatus('Device(IHUB-DATA) is Ready');
            resolve(device);
          })
          .catch(error => {
            this.onError(error);
            reject(error);
          });
      });
    };
    
  

   searchAndConnectToDevice(deviceName: string) {
    try {
     this.manager.startDeviceScan(null, null, (error, device) => {
       if (error) {
         console.error('Error scanning for devices:', error);
         return;
       }
       this.updateDeviceConnectionStatus('Scanning for devices');
       if (device && device.name === deviceName) {
         this.manager.stopDeviceScan();
         this.updateDeviceConnectionStatus(`Connecting to ${device.name}`);
         this.connectToDevice(device.id);
       }
     }); // Added closing parenthesis here
    } catch (error) {
     console.error('Error scanning for devices:', error);
    }
 };

  async disconnectDevice() {
    try {
      if (this.device) {
        await this.device.cancelConnection();
        this.device = null;
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  writeCharacteristicwithResponseForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, data: Base64)=> {
    try {
      if(!this.device) {
        this.showErrorToast(deviceNotConnectedErrorText);
        throw new Error(deviceNotConnectedErrorText);
      }
      return  this.manager.writeCharacteristicWithResponseForDevice(this.device.id,serviceUUID,characteristicUUID,data);
    } catch (error) {
      console.error('Error writing characteristic:', error);
    }
  }

  onError = (error: BleError) => {
    switch (error.errorCode) {
      case BleErrorCode.BluetoothUnauthorized:
        this.requestBluetoothPermission()
        break
      case BleErrorCode.LocationServicesDisabled:
        this.showErrorToast('Location services are disabled')
        break
      default:
        this.showErrorToast(JSON.stringify(error, null, 4))
    }
  }

  async monitorCharacteristic(
    serviceUUID: UUID,
    characteristicUUID: UUID,
    onDataReceived: (data: any) => void,
    onError: (error: any) => void,
    transactionId?: TransactionId,
    hiddeErrorDisplay?: boolean
  ) {
    try {
     if(!this.device) {
        this.showErrorToast(deviceNotConnectedErrorText);
        throw new Error(deviceNotConnectedErrorText);
     }

    this.characteristicMonitor = this.manager.monitorCharacteristicForDevice(
      this.device.id,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          if(error.errorCode === 2 && this.isCharacteristicMonitorDisconnectExpected) {
            this.isCharacteristicMonitorDisconnectExpected = false;
            return;
          }
          onError(error);
          if(!hiddeErrorDisplay)
          console.error('Error monitoring characteristic:', error);
          onError(error);
          this.characteristicMonitor?.remove();
          return;
        }
        if (characteristic && characteristic.isNotifiable) {
          onDataReceived(characteristic.value);
        }
      },
      transactionId
    )
    } catch (error) {
      console.error('Error monitoring characteristic:', error);
      onError(error);
    }
  }

  //...................State Update Functions.....................

  updateDeviceID(deviceID: DeviceId | null){
    store.dispatch(setDeviceID(deviceID));
  }

  updateDeviceName(deviceName: string | null){
    store.dispatch(setDeviceName(deviceName));
  }

  updateDeviceConnectionStatus(status: string){
    store.dispatch(setDeviceConnectionStatus(status));
  }

  updateIsDeviceConnected(connected: boolean){
    store.dispatch(setDeviceConnection(connected));
  }
  
}


export const BLEService = new BLEServiceInstance();
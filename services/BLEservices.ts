import {
    BleError,
    BleErrorCode,
    BleManager,
    Device,
    State as BluetoothState,
    LogLevel,
    type DeviceId,
    type TransactionId,
    type UUID,
    type Characteristic,
    type Base64,
    type Subscription
  } from 'react-native-ble-plx'
  import { PermissionsAndroid, Platform } from 'react-native'

  class BLEServiceInstance {
    manager: BleManager
  
    device: Device | null
  
    characteristicMonitor: Subscription | null
  
    isCharacteristicMonitorDisconnectExpected = false
  
    constructor() {
      this.device = null
      this.characteristicMonitor = null
      this.manager = new BleManager()
      this.manager.setLogLevel(LogLevel.Verbose)
    }
  
    initializeBLE = () =>
    new Promise<void>(resolve => {
      const subscription = this.manager.onStateChange(state => {
        switch (state) {
          case BluetoothState.Unsupported:
            this.showErrorToast('')
            break
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff()
            this.manager.enable().catch((error: BleError) => {
              if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
                this.requestBluetoothPermission()
              }
            })
            break
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission()
            break
          case BluetoothState.PoweredOn:
            resolve()
            subscription.remove()
            break
          default:
            console.error('Unsupported state: ', state)
        }
      }, true)
    })

    requestBluetoothPermission = async () => {
        if (Platform.OS === 'ios') {
          return true
        }
        if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
          const apiLevel = parseInt(Platform.Version.toString(), 10)
    
          if (apiLevel < 31) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            return granted === PermissionsAndroid.RESULTS.GRANTED
          }
          if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
            const result = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            ])
    
            return (
              result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
              result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
            )
          }
        }
    
        this.showErrorToast('Permission have not been granted')
    
        return false
      }

      onBluetoothPowerOff = () => {
        this.showErrorToast('Bluetooth is turned off')
      }

        showErrorToast = (message: string) => {
            console.error(message)
        }
  }


    export const BLEService = new BLEServiceInstance()
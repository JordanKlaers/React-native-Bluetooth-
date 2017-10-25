import { BleManager } from 'react-native-ble-plx';

var object = {
  newManager: ()=> {
    return new BleManager()
  },
  checkBluetoothON_OFF: (bluetoothThis)=>{
    const subscription = bluetoothThis.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log("PoweredOn");
            bluetoothThis.tempState.bluetoothState = "on";
            bluetoothThis.setState(bluetoothThis.tempState);
            bluetoothThis.scanAndConnect();
        }
        else {
          console.log("bluetooth powered off");
          bluetoothThis.tempState.bluetoothState = "off";
          bluetoothThis.setState(bluetoothThis.tempState);
        }
    }, true);
  },
  scanAndConnect: (bluetoothThis) => {
    bluetoothThis.manager.startDeviceScan(null, null, (error, device) => {
      console.log("scanning?");
        if (error) {
            return
        }
        if (device.name === 'raspberrypi') {
            bluetoothThis.manager.stopDeviceScan();
            bluetoothThis.manager.connectToDevice(device.id)
                .then((device) => {
                  bluetoothThis.tempState.device = device;
                  return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                  bluetoothThis.tempState.deviceID = device.id
                  return bluetoothThis.manager.servicesForDevice(device.id)
                })
                .then((services) => {
                  console.log(services);
                  bluetoothThis.tempState.writeServiceUUID = services[2].uuid
                  bluetoothThis.tempState.deviceConnection = "Connected!!"
                  console.log("connected");
                  return bluetoothThis.manager.characteristicsForDevice(bluetoothThis.tempState.deviceID, bluetoothThis.tempState.writeServiceUUID)
                }).then((characteristic)=> {
                  console.log(characteristic);
                  bluetoothThis.tempState.writeCharacteristicUUID = characteristic[0].uuid
                  bluetoothThis.setState(bluetoothThis.tempState, ()=> {})
                }, (error) => {
                  console.log(error);
                });
        }
    });
  },
  checkConnection: (bluetoothThis) => {
    console.log(bluetoothThis.state.deviceID);
    bluetoothThis.manager.isDeviceConnected(bluetoothThis.state.deviceID).then((result)=>{
      console.log(result); // TRUE if connected
    })
  },
  checkBLEState: (bluetoothThis) => {
    bluetoothThis.manager.state().then((result)=> {
      console.log(result);  //poweredOn or poweredOff
    })
  },
  sendDataThroughService: (bluetoothThis) => {
    var encodedString = btoa("255");
    var pattern = [255,255,255,250,250,250,240,240,240,230,230,230,100,100,100,0,0,0,1,1,1,13,13,13,6,6,6,7,7,8,8,8,100,100,100,255,255,255,250,250,250,240,240,240,230,230,999999999999]
    for(let i=0; i< pattern.length; i++){
      var temp = btoa(pattern[i]);
      bluetoothThis.state.device.writeCharacteristicWithoutResponseForService(bluetoothThis.state.writeServiceUUID, bluetoothThis.state.writeCharacteristicUUID, temp).then((result)=>{
        console.log(result);
      }, (err)=>{
        console.log(err);
      })
    }
  }
}

module.exports = object

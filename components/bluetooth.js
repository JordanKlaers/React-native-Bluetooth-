/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import reducer from '../reducers/index.js'

const loggerMiddleware = createLogger({ predicator: (getState, action) => __DEV__});

function configureStore(initialState) { //put middleware here
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({ });

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class Bluetooth extends Component<{}> {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
      device: null,
      deviceID: null,
      deviceConnection: "Not Connected",
      writeServiceUUID: null,
      writeCharacteristicUUID: null,
      bluetoothState: "off"
    }
    this.deviceID = null;
    this.deviceConnection = "Not connected"
  }

  tempState = {
    device: null,
    deviceID: null,
    deviceConnection: "Not Connected",
    writeServiceUUID: null,
    writeCharacteristicUUID: null,
    bluetoothState: "off"
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log("PoweredOn");
            this.tempState.bluetoothState = "on";
            this.setState(this.tempState);
            this.scanAndConnect();
            // subscription.remove();
        }
        else {
          this.tempState.bluetoothState = "off";
          this.setState(this.tempState);
        }
    }, true);
  }

  componentDidMount() {

  }

  scanAndConnect() {
    console.log("scanning?");
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            return
        }
        if (device.name === 'raspberrypi') {
            this.manager.stopDeviceScan();

            this.manager.connectToDevice(device.id)
                .then((device) => {
                  this.tempState.device = device;
                  return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                  this.tempState.deviceID = device.id
                  return this.manager.servicesForDevice(device.id)
                })
                .then((services) => {
                  console.log(services);
                  this.tempState.writeServiceUUID = services[2].uuid
                  this.tempState.deviceConnection = "Connected!!"
                  console.log("connected");
                  return this.manager.characteristicsForDevice(this.tempState.deviceID, this.tempState.writeServiceUUID)
                }).then((characteristic)=> {
                  console.log(characteristic);
                  this.tempState.writeCharacteristicUUID = characteristic[0].uuid
                  this.setState(this.tempState, ()=> {})
                }, (error) => {
                  console.log(error);
                });
        }
    });
  }

  checkConnection = () => {
    console.log(this.state.deviceID);
    this.manager.isDeviceConnected(this.state.deviceID).then((result)=>{
      console.log(result); // TRUE if connected
    })
  }

  checkBLEState = () => {
    this.manager.state().then((result)=> {
      console.log(result);  //poweredOn or poweredOff
    })
  }

  sendDataThroughService = () => {
    var encodedString = btoa("255");
    var pattern = [255,255,255,250,250,250,240,240,240,230,230,230,100,100,100,0,0,0,1,1,1,13,13,13,6,6,6,7,7,8,8,8,100,100,100,255,255,255,250,250,250,240,240,240,230,230,999999999999]
    for(let i=0; i< pattern.length; i++){
      var temp = btoa(pattern[i]);
      this.state.device.writeCharacteristicWithoutResponseForService(this.state.writeServiceUUID, this.state.writeCharacteristicUUID, temp).then((result)=>{
        console.log(result);
      }, (err)=>{
        console.log(err);
      })
    }
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
        </Text>
      </View>
    );
  }
}
//
// class App = () => {
//   <Provider store={store}>
//     <Bluetooth />
//   </Provider>
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    'backgroundColor': 'rgba(0,0,0,.5)'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  upload: {
      'position': 'absolute',
      'width': '94%',
      'height': 70,
      'marginLeft': '3%',
      'marginTop': 10,
      'marginBottom': 5,
      'backgroundColor': 'white',
      'borderRadius': 15,
      'borderColor': 'black',
      'borderWidth': 5,
      'overflow': 'hidden'
    },
  title: {
      'position': 'relative',
      'top': 0,
      'marginLeft': '4%',
      'marginTop': '5%',
      'backgroundColor': 'rgba(0,0,0,.5)',
      'borderRadius': 20,
      'borderColor': 'black',
      'borderWidth': 5,
      'width': '90%',
      'height': 100,
    },
    text: {
      'textAlign': 'center',
      'fontSize': 40,
      'marginTop': 0,
    }
});

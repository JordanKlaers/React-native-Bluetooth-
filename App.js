/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor() {
    super();
    this.manager = new BleManager();

  }

  componentWillMount() {
      // console.log(this.manager);
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log("PoweredOn");
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'raspberrypi') {
            this.manager.stopDeviceScan();

            this.manager.connectToDevice(device.id)
                .then((device) => {
                  console.log("DISCOVERING");
                  console.log();
                  // return this.manager.readCharacteristicForDevice(device.serviceUUIDs)
                  return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                  console.log("DISCOVERED");
                  return this.manager.servicesForDevice(device.id)
                  // console.log(device);
                })
                .then((device) => {
                  console.log("SUCCESS");
                  console.log(device);
                }, (error) => {
                  console.log(error);
                });



            // device.connect()
            //     .then((device) => {
            //         return device.discoverAllServicesAndCharacteristics(device.id)
            //     })
            //     .then((device) => {
            //       console.log("device connected!");
            //       console.log(device);
            //        // Do work on device with services and characteristics
            //     })
            //     .catch((error) => {
            //         // Handle errors
            //         console.log(error);
            //     });
        }
    });
  }



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

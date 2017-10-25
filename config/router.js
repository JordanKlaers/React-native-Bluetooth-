import React from 'react';
import { StackNavigator } from 'react-navigation';
import Bluetooth from '../components/bluetooth.js';


export const Root = StackNavigator({
  Home: {
    screen: Bluetooth,
  }
})

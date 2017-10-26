import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';


class AppContainer extends Component {
  render(){
    return (
      <View style={{marginTop: 50}}>
        <Text>
          hello
        </Text>
      </View>
    )
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(() => ( return {} ), mapDispatchToProps)(AppContainer);

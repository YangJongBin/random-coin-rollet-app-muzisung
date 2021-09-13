import React, {Component} from 'react';
import {Text, StyleSheet, Dimensions, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import _ from 'lodash';

import MyHeader from '../components/MyHeader';
import coinUrlInfo from './coinUrlInfo';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export default class Shell extends Component {
  render() {
    return (
      <SafeAreaProvider
        style={{
          width: screenWidth,
          height: screenHeight,
          backgroundColor: '#5fbaff',
        }}>
        <MyHeader />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({});

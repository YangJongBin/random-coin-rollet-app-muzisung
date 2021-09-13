import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Header} from 'react-native-elements';

export default class MyHeader extends Component {
  render() {
    return (
      <Header
        barStyle="default"
        // centerComponent={
        //   <Text style={{color: '#ffee7e', fontWeight: 'bold'}}>MUZISUNG</Text>
        // }
        containerStyle={{
          backgroundColor: 'transparent',
          borderBottomColor: 'transparent',
        }}></Header>
    );
  }
}

const styles = StyleSheet.create({});

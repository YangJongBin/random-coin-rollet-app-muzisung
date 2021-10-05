import 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-community/async-storage';
import {SpeedDial, Icon} from 'react-native-elements';

import React, {useState, useRef, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Home from './Home';
import Splash from './Splash';
import Shell from './Shell';
import _ from 'lodash';

const Stack = createStackNavigator();

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const SplashStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}></Stack.Screen>
    </Stack.Navigator>
  );
};

const MainStack = props => {
  return (
    <Stack.Navigator initialRouteName={_.toString(props.stackName)}>
      <Stack.Screen
        name="Spin"
        component={Home}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}></Stack.Screen>
      <Stack.Screen
        name="Shell"
        component={Shell}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default function Navi() {
  const {tickerInfo} = useSelector(state => state.bithumbTicker);
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef(null);
  const [stackName, setStackName] = useState('Spin');

  // 최근 접속 메뉴
  AsyncStorage.getItem('stackName').then(res => {
    setStackName(res);
  });

  return (
    <NavigationContainer ref={navigationRef}>
      {_.isEmpty(tickerInfo) ? (
        <SplashStack />
      ) : (
        <MainStack stackName={stackName} />
      )}

      {/* <SpeedDial
        style={{opacity: _.isEmpty(resInfo.data) ? 0 : 1}}
        isOpen={isOpen}
        color={'#2980b9'}
        icon={{type: 'font-awesome', name: 'angle-up', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}>
        <SpeedDial.Action
          color={'#2980b9'}
          icon={{type: 'foundation', name: 'bitcoin-circle', color: '#fff'}}
          onPress={() => {
            navigationRef.current?.navigate('Spin');
            AsyncStorage.setItem('stackName', 'Spin');
            setIsOpen(false);
          }}
        />
        <SpeedDial.Action
          color={'#2980b9'}
          icon={{name: 'settings', color: '#fff'}}
          onPress={() => {
            navigationRef.current?.navigate('Shell');
            AsyncStorage.setItem('stackName', 'Shell');
            setIsOpen(false);
          }}
        />
      </SpeedDial> */}
    </NavigationContainer>
  );
}

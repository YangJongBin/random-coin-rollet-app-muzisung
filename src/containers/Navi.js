import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Home from './Home';
import Splash from './Splash';
import _ from 'lodash';

const Stack = createStackNavigator();

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

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default function Navi() {
  const {resInfo} = useSelector(state => state.bithumb);

  return (
    <NavigationContainer>
      {/* {_.isEmpty(resInfo.data) ? <SplashStack /> : <MainStack />} */}
      <MainStack></MainStack>
    </NavigationContainer>
  );
}

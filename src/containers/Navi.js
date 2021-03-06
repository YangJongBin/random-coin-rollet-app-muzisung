import 'react-native-gesture-handler';
import {StyleSheet, View, BackHandler, Linking, Alert} from 'react-native';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-community/async-storage';
import {SpeedDial, Icon} from 'react-native-elements';

import React, {useState, useRef, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import VersionCheck from 'react-native-version-check';

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

// const SplashStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Splash"
//         component={Splash}
//         options={{headerShown: false}}></Stack.Screen>
//     </Stack.Navigator>
//   );
// };

const MainStack = props => {
  return (
    <Stack.Navigator initialRouteName={_.toString(props.stackName)}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
          gestureEnabled: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Spin"
        component={Home}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
          gestureEnabled: false,
        }}></Stack.Screen>
      <Stack.Screen
        name="Shell"
        component={Shell}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
          gestureEnabled: false,
        }}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default function Navi() {
  const {marketAllList} = useSelector(state => state.upbitMarketAll);
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef(null);
  const [stackName, setStackName] = useState('Splash');
  const [isLastestVersion, setIsLastestVersion] = useState(false);

  // ?????? ?????? ??????
  // AsyncStorage.getItem('stackName').then(res => {
  //   setStackName(res);
  // });

  useEffect(() => {
    VersionCheck.getLatestVersion({
      provider: 'appStore',
    }).then(appStoreVersion => {
      const appStoreVer = _.chain(appStoreVersion)
        .replace('.', '')
        .replace('.', '')
        .toNumber()
        .value();
      const currVer = _.chain(VersionCheck.getCurrentVersion())
        .replace('.', '')
        .replace('.', '')
        .toNumber()
        .value();

      if (appStoreVer > currVer) {
        Alert.alert(
          '????????????(Update)',
          '?????? ??????????????? ????????????. ???????????????????????????????',
          [
            {
              text: '????????????',
              onPress: () => {
                Linking.openURL(
                  'https://apps.apple.com/kr/app/muzisung-random-coin/id1580401825',
                );
                setIsLastestVersion(true);
                // BackHandler.exitApp();
              },
            },
            {
              text: '?????????',
              onPress: () => {
                setIsLastestVersion(true);
                // BackHandler.exitApp();
              },
            },
          ],
        );
      } else {
        setIsLastestVersion(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(marketAllList) && isLastestVersion) {
      setStackName('Spin');
      navigationRef.current?.navigate('Spin');
    } else {
      setStackName('Splash');
      navigationRef.current?.navigate('Splash');
    }
  }, [isLastestVersion, marketAllList]);

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack stackName={stackName} />

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

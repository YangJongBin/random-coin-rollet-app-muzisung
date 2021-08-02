import React, {useCallback, useEffect} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {getBithumbCoinList} from '../modules/bithumb';
import _ from 'lodash';

export default function Splash() {
  const dispatch = useDispatch();
  const reqBithumbCoinList = useCallback(
    () => dispatch(getBithumbCoinList()),
    [dispatch],
  );

  const {isLoading, isError, screenMoveTarget, resInfo} = useSelector(
    state => state.bithumb,
  );

  // const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      reqBithumbCoinList();
    }, 2500);
  }, []);

  // if(_.toNumber(resInfo.status) < 500){
  //     navigation.navigate('Home');
  // }

  return (
    <View style={styles.content}>
      <LottieView
        source={require('../lottie/loading.json')}
        loop
        style={styles.loading}
        autoPlay></LottieView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5fbaff',
  },

  loading: {
    width: '30%',
    // marginLeft: 5,
    // marginBottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

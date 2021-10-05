import React, {useCallback, useEffect} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import _ from 'lodash';

import {getBithumbTickerInfo} from '../modules/bithumb/bithumbTicker';

export default function Splash() {
  const dispatch = useDispatch();
  const initBithumbRequest = useCallback(
    () => dispatch(getBithumbTickerInfo()),
    [dispatch],
  );

  useEffect(() => {
    setTimeout(() => {
      initBithumbRequest();
    }, 2500);
  }, []);

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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

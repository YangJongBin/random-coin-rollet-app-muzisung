import React, {useCallback, useEffect} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import _ from 'lodash';

import {getUpbitMarketAllList} from '../modules/upbit/upbitMarketAll';

export default function Splash() {
  const dispatch = useDispatch();
  const initUpbitRequest = useCallback(
    () => dispatch(getUpbitMarketAllList()),
    [dispatch],
  );

  useEffect(() => {
    setTimeout(() => {
      initUpbitRequest();
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

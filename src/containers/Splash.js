import React, {useCallback, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

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
    }, 1000);
  }, []);

  // if(_.toNumber(resInfo.status) < 500){
  //     navigation.navigate('Home');
  // }

  return (
    <View>
      <Text>Splash</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

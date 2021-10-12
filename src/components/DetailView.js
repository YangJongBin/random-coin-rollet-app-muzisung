import React, {
  Component,
  useContext,
  createContext,
  useState,
  useRef,
} from 'react';
import {Text, StyleSheet, View, Dimensions, Animated} from 'react-native';
import {useSpring, animated} from '@react-spring/native';

const AnimatedView = animated(View);

export const DetailView = props => {
  const detailAreaAnimation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
  });
  const detailArea1Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    delay: 100,
  });
  const detailArea2Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    delay: 200,
  });
  const detailArea3Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    delay: 300,
  });

  return (
    <AnimatedView style={[styles.container, detailAreaAnimation]}>
      <AnimatedView style={[styles.detailArea1, detailArea1Animation]}>
        {/* 차트 영역 */}
        <View style={styles.priceArea}>
          <View style={{alignItems: 'flex-start'}}>
            <View>
              <Text style={styles.currPriceText}>1,000,000</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View>
              <Text style={styles.priceRateText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.comparePriecText}>+200,000</Text>
            </View>
          </View>
        </View>
        <View style={styles.chartArea}>
          <Text>chart</Text>
        </View>
      </AnimatedView>
      {/* 누적 거래 금액 */}
      <AnimatedView style={[styles.detailArea2, detailArea2Animation]}>
        <View style={{flex: 1}}>
          <Text style={styles.tradePriceText}>TRADE</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.tradePriceText}>2,000,000,000</Text>
        </View>
      </AnimatedView>
      {/* 호가창 */}
      <AnimatedView style={[styles.detailArea3, detailArea3Animation]}>
        {/* TOP */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#3498db',
                marginRight: 0,
                borderTopLeftRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#e74c3c',
                marginLeft: 0,
                borderTopRightRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
        </View>
        {/* MIDDLE */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#3498db',
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#e74c3c',
                marginLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
        </View>
        {/* BOTTOM */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#3498db',
                marginRight: 0,
                borderBottomLeftRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#e74c3c',
                marginLeft: 0,
                borderBottomRightRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.orderBookText}>1,000,000</Text>
              <Text style={styles.orderBookText}>+4.41</Text>
            </View>
            <View>
              <Text style={styles.orderBookText}>5.31513</Text>
            </View>
          </View>
        </View>
      </AnimatedView>
    </AnimatedView>
  );
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '65%',
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailArea1: {
    width: '80%',
    height: 150, // FIXME:
    flexDirection: 'column',
    margin: 3,
    alignItems: 'flex-start',
    borderRadius: 7,
    backgroundColor: '#4d6883', //FIXME:
  },
  detailArea2: {
    width: '80%',
    height: 50, // FIXME:
    flexDirection: 'row',
    margin: 3,
    padding: 10,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#4d6883', //FIXME:
  },
  detailArea3: {
    width: '80%',
    // height: 150, // FIXME:
    flexDirection: 'column',
    margin: 3,
    // padding: 5,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#4d6883', //FIXME:
  },
  priceArea: {
    position: 'absolute',
    margin: 10,
  },
  currPriceText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#e74c3c', // FIXME:
  },
  priceRateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e74c3c', // FIXME:
  },
  comparePriecText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#e74c3c', // FIXME:
  },
  chartArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  tradePriceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  singleOrderBookArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    // margin: 5,
    padding: 10,
    // borderRadius: 5,
  },
  orderBookText: {
    fontSize: 12,
  },
});

export default DetailView;

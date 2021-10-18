import React, {
  Component,
  useContext,
  createContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import {Text, StyleSheet, View, Dimensions, Animated} from 'react-native';
import {useSpring, animated} from '@react-spring/native';
import {LineChart, Grid, AreaChart} from 'react-native-svg-charts';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import * as shape from 'd3-shape';
import _ from 'lodash';

const AnimatedView = animated(View);
const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export const DetailView = props => {
  const detailAreaAnimation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
  });
  const detailArea1Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    shadowOffset: {height: props.isDetailView ? 3 : 0},
    delay: 100,
  });
  const detailArea2Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    shadowOffset: {height: props.isDetailView ? 3 : 0},
    delay: 200,
  });
  const detailArea3Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    shadowOffset: {height: props.isDetailView ? 3 : 0},
    delay: 300,
  });

  // TODO:

  let price = 0;
  let priceRate = 0;
  let comparePrice = 0;
  let tradePrice = 0;
  let chartData = [];
  let priceRateUnit = '';
  let priceColor = 'white';

  if (!_.isEmpty(props.candlesList)) {
    chartData = _.chain(props.candlesList)
      .map('trade_price')
      .map(_.toNumber)
      .reverse()
      .value();
  }

  if (!_.isEmpty(props.tickerList)) {
    const tickerInfo = _.head(props.tickerList);

    price = _.chain(tickerInfo)
      .get('trade_price')
      .toNumber()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    priceRate = _.floor(tickerInfo.signed_change_rate, 2);
    comparePrice = tickerInfo.change_price;
    tradePrice = _.chain(tickerInfo)
      .get('acc_trade_price_24h')
      .toNumber()
      .floor()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    if (tickerInfo.change === 'RISE') {
      priceColor = '#ff4757';
    } else if (tickerInfo.change === 'FALL') {
      priceColor = '#0652DD';
      priceRateUnit = '▼';
    }
  }

  // ticker
  // if (!_.isEmpty(props.tickerInfo)) {
  //   comparePrice = _.chain(props.tickerInfo.data.fluctate_24H)
  //     .toNumber()
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //     .value();
  // }

  const Gradient = ({index}) => (
    <Defs key={index}>
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop
          offset={'0%'}
          stopColor={'rgb(26, 255, 146)'}
          stopOpacity={0.7}></Stop>
        <Stop
          offset={'100%'}
          stopColor={'rgb(26, 255, 146)'}
          stopOpacity={0}></Stop>
      </LinearGradient>
    </Defs>
  );

  return (
    <AnimatedView style={[styles.container, detailAreaAnimation]}>
      <AnimatedView style={[styles.detailArea1, detailArea1Animation]}>
        {/* 차트 영역 */}
        <View style={styles.chartArea}>
          <AreaChart
            style={{
              width: '100%',
              height: '100%',
              // padding: 5,
            }}
            data={chartData}
            curve={shape.curveBasis}
            svg={{
              fill: 'url(#gradient)',
              stroke: 'rgb(26, 255, 146)',
              strokeWidth: 0,
            }}
            contentInset={{top: 20, bottom: 20}}>
            {/* <Grid /> */}
            <Gradient />
          </AreaChart>
        </View>
        <View style={styles.priceArea}>
          <View style={{alignItems: 'flex-start'}}>
            <View>
              <Text style={[styles.currPriceText, {color: priceColor}]}>
                {price}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View>
              <Text style={[styles.priceRateText, {color: priceColor}]}>
                {priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.comparePriecText, {color: priceColor}]}>
                {priceRateUnit}
                {comparePrice}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedView>
      {/* 누적 거래 금액 */}
      <AnimatedView style={[styles.detailArea2, detailArea2Animation]}>
        <View style={{flex: 1}}>
          <Text style={styles.tradePriceText}>TRADE</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.tradePriceText}>{tradePrice}</Text>
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
                // borderTopLeftRadius: 7,
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
                // borderTopRightRadius: 7,
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#4d6883', //FIXME:
    shadowOpacity: 0.8,
  },
  detailArea2: {
    width: '80%',
    height: 50, // FIXME:
    flexDirection: 'row',
    margin: 3,
    padding: 10,
    alignItems: 'center',
    // borderRadius: 7,
    backgroundColor: '#4d6883', //FIXME:
    shadowOpacity: 0.8,
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
    shadowOpacity: 0.8,
  },
  priceArea: {
    position: 'absolute',
    margin: 10,
  },
  currPriceText: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  priceRateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  comparePriecText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  chartArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      // height: 1,
    },
  },
  tradePriceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    // shadowOpacity: 0.8,
    // shadowOffset: {
    //   height: 1,
    // },
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

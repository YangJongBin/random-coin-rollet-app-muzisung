import React from 'react';
import {Text, StyleSheet, View, Dimensions, Animated} from 'react-native';
import {useSpring, animated} from '@react-spring/native';
import {AreaChart} from 'react-native-svg-charts';
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

  let price = 0;
  let priceRate = 0;
  let comparePrice = 0;
  let tradePrice = 0;
  let chartData = [];
  let priceRateUnit = '';
  let priceColor = 'white';
  let askList = [
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
  ];
  let bidList = [
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
    {
      price: 0,
      size: 0,
      prcieRate: '0.00',
      color: 'white',
    },
  ];

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

    priceRate = _.floor(tickerInfo.signed_change_rate, 3);
    comparePrice = tickerInfo.change_price;
    tradePrice = _.chain(tickerInfo)
      .get('acc_trade_price_24h')
      .toNumber()
      .multiply(0.000001)
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

  if (!_.isEmpty(props.orderBookList)) {
    const priceNum = _.chain(price).replace(',', '').toNumber().value();

    askList = _.chain(props.orderBookList)
      .head()
      .get('orderbook_units')
      .map(info => {
        const result = {
          price: _.chain(info)
            .get('ask_price')
            .toNumber()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            .value(),
          size: _.chain(info).get('ask_size').toNumber().floor(2).value(),
          color: 'white',
          priceRate: _.chain(info)
            .get('ask_price')
            .toNumber()
            .subtract(priceNum)
            .divide(priceNum)
            .multiply(100)
            .floor(2)
            .value(),
        };

        if (result.priceRate > 0) {
          result.color = '#d95b66';
        } else if (result.priceRate < 0) {
          result.color = '#3b71d4';
        }

        if (_.size(_.replace(result.priceRate, '-', '')) === 3) {
          result.priceRate = result.priceRate + '0';
        }

        result.priceRate = result.priceRate == 0 ? '0.00' : result.priceRate;

        return result;
      })
      .value();

    bidList = _.chain(props.orderBookList)
      .head()
      .get('orderbook_units')
      .map(info => {
        const result = {
          price: _.chain(info)
            .get('bid_price')
            .toNumber()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            .value(),
          size: _.chain(info).get('bid_size').toNumber().floor(2).value(),
          color: 'white',
          priceRate: _.chain(info)
            .get('bid_price')
            .toNumber()
            .subtract(priceNum)
            .divide(priceNum)
            .multiply(100)
            .floor(2)
            .value(),
        };

        if (result.priceRate > 0) {
          result.color = '#d95b66';
        } else if (result.priceRate < 0) {
          result.color = '#3b71d4';
        }

        if (_.size(_.replace(result.priceRate, '-', '')) === 3) {
          result.priceRate = result.priceRate + '0';
        }

        result.priceRate = result.priceRate == 0 ? '0.00' : result.priceRate;

        return result;
      })
      .value();
  }

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
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={[styles.currPriceText, {color: priceColor}]}>
                {price}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 4,
                  marginLeft: 4,
                  color: priceColor,
                }}>
                KRW
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
          <Text style={styles.tradePriceText}>{tradePrice} M</Text>
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
                backgroundColor: '#1f80db',
                marginRight: 0,
                // borderTopLeftRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: askList[0].color}]}>
                {askList[0].price}
              </Text>
              <Text style={[styles.orderBookText, {color: askList[0].color}]}>
                {askList[0].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: askList[0].color}]}>
                {askList[0].size}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#cf5144',
                marginLeft: 0,
                // borderTopRightRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: bidList[0].color}]}>
                {bidList[0].price}
              </Text>
              <Text style={[styles.orderBookText, {color: bidList[0].color}]}>
                {bidList[0].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: bidList[0].color}]}>
                {bidList[0].size}
              </Text>
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
                backgroundColor: '#1f80db',
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: askList[1].color}]}>
                {askList[1].price}
              </Text>
              <Text style={[styles.orderBookText, {color: askList[1].color}]}>
                {askList[1].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: askList[1].color}]}>
                {askList[1].size}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#cf5144',
                marginLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: bidList[1].color}]}>
                {bidList[1].price}
              </Text>
              <Text style={[styles.orderBookText, {color: bidList[1].color}]}>
                {bidList[1].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: bidList[1].color}]}>
                {bidList[1].size}
              </Text>
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
                backgroundColor: '#1f80db',
                marginRight: 0,
                borderBottomLeftRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: askList[2].color}]}>
                {askList[2].price}
              </Text>
              <Text style={[styles.orderBookText, {color: askList[2].color}]}>
                {askList[2].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: askList[2].color}]}>
                {askList[2].size}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.singleOrderBookArea,
              {
                backgroundColor: '#cf5144',
                marginLeft: 0,
                borderBottomRightRadius: 7,
              },
            ]}>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.orderBookText, {color: bidList[2].color}]}>
                {bidList[2].price}
              </Text>
              <Text style={[styles.orderBookText, {color: bidList[2].color}]}>
                {bidList[2].priceRate}%
              </Text>
            </View>
            <View>
              <Text style={[styles.orderBookText, {color: bidList[2].color}]}>
                {bidList[2].size}
              </Text>
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
    top: '66%',
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailArea1: {
    width: '80%',
    height: 150,
    flexDirection: 'column',
    margin: 3,
    alignItems: 'flex-start',
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#4d6883',
    shadowOpacity: 0.8,
  },
  detailArea2: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    margin: 3,
    padding: 10,
    alignItems: 'center',
    // borderRadius: 7,
    backgroundColor: '#4d6883',
    shadowOpacity: 0.8,
  },
  detailArea3: {
    width: '80%',
    // height: 150,
    flexDirection: 'column',
    margin: 3,
    // padding: 5,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#4d6883',
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
    opacity: 0.95,
    // borderRadius: 5,
  },
  orderBookText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DetailView;

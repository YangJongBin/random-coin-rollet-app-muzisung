import React, {useState} from 'react';
import {Text, StyleSheet, View, Dimensions, Animated} from 'react-native';
import {useSpring, animated} from '@react-spring/native';
import {AreaChart} from 'react-native-svg-charts';
import LottieView from 'lottie-react-native';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import * as shape from 'd3-shape';
import _ from 'lodash';
import LinearGradientView from 'react-native-linear-gradient';

const AnimatedView = animated(View);

export const DetailView = props => {
  const detailAreaAnimation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
  });
  const detailArea1Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    shadowOffset: {height: props.isDetailView ? 3 : 0},
    delay: 200,
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
  const detailArea4Animation = useSpring({
    opacity: props.isDetailView ? 1 : 0,
    shadowOffset: {height: props.isDetailView ? 3 : 0},
    delay: 400,
  });

  const [isWarning, setIsWarning] = useState(false);

  let coinName = 'ReTry';
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

  let accTradePrice = 0;
  let accTradePrice24h = 0;
  let highest52WeekPrice = 0;
  let lowest52WeekPrice = 0;
  let prevClosingPrice = 0;

  // 코인 이름 정보
  if (!_.isEmpty(props.coinInfo)) {
    coinName = `${props.coinInfo.korean_name}(${_.replace(
      props.coinInfo.market,
      'KRW-',
      '',
    )})`;

    if (props.coinInfo.market_warning === 'CAUTION') {
      setIsWarning(true);
    }
  }

  // 캔들
  if (!_.isEmpty(props.candlesList)) {
    chartData = _.chain(props.candlesList)
      .map('trade_price')
      .map(_.toNumber)
      .reverse()
      .value();
  }

  // tickerList
  if (!_.isEmpty(props.tickerList)) {
    const tickerInfo = _.head(props.tickerList);

    price = _.chain(tickerInfo)
      .get('trade_price')
      .toNumber()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    priceRate = _.floor(tickerInfo.signed_change_rate, 3);
    comparePrice = tickerInfo.change_price;
    accTradePrice =
      _.chain(tickerInfo)
        .get('acc_trade_price')
        .toNumber()
        .multiply(0.000001)
        .floor()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .value() + ' M';

    accTradePrice24h =
      _.chain(tickerInfo)
        .get('acc_trade_price_24h')
        .toNumber()
        .multiply(0.000001)
        .floor()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .value() + ' M';

    highest52WeekPrice = _.chain(tickerInfo)
      .get('highest_52_week_price')
      .toNumber()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    lowest52WeekPrice = _.chain(tickerInfo)
      .get('lowest_52_week_price')
      .toNumber()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    prevClosingPrice = _.chain(tickerInfo)
      .get('prev_closing_price')
      .toNumber()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .value();

    if (tickerInfo.change === 'RISE') {
      priceColor = '#d13d3d';
    } else if (tickerInfo.change === 'FALL') {
      priceColor = '#0e2fbd';
      priceRateUnit = '▼';
    }
  }

  // 호가창
  if (!_.isEmpty(props.orderBookList)) {
    const priceStr = _.toString(price);
    const priceNum = _.toNumber(priceStr.replaceAll(',', ''));

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
          result.color = '#d13d3d';
        } else if (result.priceRate < 0) {
          result.color = '#2d45ab';
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
          result.color = '#ae3131';
        } else if (result.priceRate < 0) {
          result.color = '#2d45ab';
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
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'#af8b19'} stopOpacity={1}></Stop>
        <Stop offset={'70%'} stopColor={'#fdd349'} stopOpacity={1}></Stop>
      </LinearGradient>
    </Defs>
  );

  return (
    <AnimatedView style={[styles.container, detailAreaAnimation]}>
      {/* TITLE */}
      <View
        style={{
          width: '100%',
          height: 40,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginLeft: 23,
          marginTop: 60,
          marginBottom: 210,
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'TmonMonsoriBlack',
            fontWeight: 'bold',
            color: '#003872',
          }}>
          {_.toUpper(coinName)}
        </Text>
        <LottieView
          autoPlay
          loop={true}
          style={{width: 23, opacity: isWarning ? 1 : 0}}
          source={require('../lottie/warning.json')}
        />
      </View>
      <AnimatedView style={[styles.detailArea1, detailArea1Animation]}>
        <LinearGradientView
          colors={['#2d78c5', 'transparent']}
          style={[styles.linearGradient, {width: '100%'}]}>
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
                    fontFamily: 'TmonMonsoriBlack',
                    marginBottom: 4,
                    marginLeft: 6,
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
        </LinearGradientView>
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
                backgroundColor: '#3b72bb',
                marginLeft: 0,
                marginRight: 0.5,
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
                backgroundColor: '#d65e51',
                marginLeft: 0.5,
                marginRight: 0,
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
                backgroundColor: '#3b72bb',
                marginRight: 0.5,
                marginLeft: 0,
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
                backgroundColor: '#d65e51',
                marginLeft: 0.5,
                marginRight: 0,
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
                backgroundColor: '#3b72bb',
                marginRight: 0.5,
                marginLeft: 0,
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
                backgroundColor: '#d65e51',
                marginLeft: 0.5,
                marginRight: 0,
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
      <AnimatedView style={[styles.detailArea4, detailArea4Animation]}>
        <View>
          <Text style={styles.detailInfoText}>누적 거래 대금</Text>
          <Text style={styles.detailInfoText}>24시간 누적 거래 대금</Text>
          <Text style={styles.detailInfoText}>52주 신고가</Text>
          <Text style={styles.detailInfoText}>52주 신저가</Text>
          <Text style={styles.detailInfoText}>전일 종가</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.detailInfoText}>{accTradePrice}</Text>
          <Text style={styles.detailInfoText}>{accTradePrice24h}</Text>
          <Text style={styles.detailInfoText}>{highest52WeekPrice}</Text>
          <Text style={styles.detailInfoText}>{lowest52WeekPrice}</Text>
          <Text style={styles.detailInfoText}>{prevClosingPrice}</Text>
        </View>
      </AnimatedView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // top: '66%',
    width: '100%',
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  detailArea1: {
    width: '100%',
    height: 150,
    flexDirection: 'column',
    margin: 3,
    alignItems: 'flex-start',
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // backgroundColor: '#2d78c5',
    shadowOpacity: 0.6,
  },
  detailArea2: {
    width: '100%',
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
    width: '100%',
    // height: 150,
    flexDirection: 'column',
    margin: 3,
    // padding: 5,
    alignItems: 'center',
    borderRadius: 7,
    // backgroundColor: '#4d6883',
    shadowOpacity: 0.6,
  },
  detailArea4: {
    width: '100%',
    flexDirection: 'row',
    margin: 3,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#2d78c5',
    shadowOpacity: 0.6,
  },
  priceArea: {
    position: 'absolute',
    margin: 8,
    marginLeft: 17,
  },
  currPriceText: {
    fontSize: 23,
    fontFamily: 'TmonMonsoriBlack',
    fontWeight: 'bold',
  },
  priceRateText: {
    fontFamily: 'TmonMonsoriBlack',
    fontSize: 13,
    fontWeight: '600',
  },
  comparePriecText: {
    marginLeft: 10,
    fontFamily: 'TmonMonsoriBlack',
    fontSize: 13,
    fontWeight: '400',
  },
  chartArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // shadowOpacity: 0.5,
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
    margin: 0.5,
    padding: 10,
    opacity: 0.95,
    borderRadius: 7,
  },
  orderBookText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'TmonMonsoriBlack',
  },
  detailInfoText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'TmonMonsoriBlack',
    margin: 3,
  },
  linearGradient: {
    // flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 5,
  },
});

export default DetailView;

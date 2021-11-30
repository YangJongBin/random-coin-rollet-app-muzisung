import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {useSelector, useDispatch} from 'react-redux';
import {Text, Button} from 'react-native-elements';
import Sound from 'react-native-sound';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import admob, {
  InterstitialAd,
  TestIds,
  BannerAdSize,
  MaxAdContentRating,
  AdEventType,
  BannerAd,
} from '@react-native-firebase/admob';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSpring, animated} from '@react-spring/native';

import MyHeader from '../components/MyHeader';
import coinUrlInfo from './coinUrlInfo';
import DetailView from '../components/DetailView';

// upbit
import {getUpbitCandlesList} from '../modules/upbit/upbitCandles';
import {getUpbitOrderBookList} from '../modules/upbit/upbitOrderBook';
import {getUpbitTickerList} from '../modules/upbit/upbitTicker';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
const interstitialAd = InterstitialAd.createForAdRequest(
  // TestIds.INTERSTITIAL,
  'ca-app-pub-8566072639292145/6667090011',
  {
    requestNonPersonalizedAdsOnly: true,
    // keywords: ['fashion', 'clothing'],
  },
);

export default function Home() {
  // state
  const [coinsNameArr, setCoinsNameArr] = useState({});
  const [selectedCoinName, setSelectedCoinName] = useState('');
  const [selectedCoinInfo, setSelectedCoinInfo] = useState({});
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [isTexture, setIstexture] = useState(false);
  const [loadingOpacity, setLoadingOpacity] = useState(1);
  const [twinkleOpacity, setTwinkleOpacity] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailBtnOpacity, setDetailBtnOpacity] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [bannaerOpacity, setBannerOpacity] = useState(1);

  Sound.setCategory('Playback', true);
  Sound.setActive(true);

  const resultSound = new Sound(require('../sound/result.mp3')); // 결과 사운드
  const spinSound = new Sound(require('../sound/spin.mp3')); // 터치 순간 사운드

  // upbit 데이터 요청 결과
  const {candlesList} = useSelector(state => state.upbitCandles);
  const {marketAllList} = useSelector(state => state.upbitMarketAll);
  const {tickerList} = useSelector(state => state.upbitTicker);
  const {orderBookList} = useSelector(state => state.upbitOrderBook);

  // dispatch
  const dispatch = useDispatch();
  const reqUpbitCandlesList = useCallback(
    params => {
      dispatch(getUpbitCandlesList(params));
    },
    [dispatch],
  );

  const reqUpbitTickerList = useCallback(
    params => {
      dispatch(getUpbitTickerList(params));
    },
    [dispatch],
  );

  const reqUpbitOrderBookList = useCallback(
    params => {
      dispatch(getUpbitOrderBookList(params));
    },
    [dispatch],
  );

  // global 변수
  this.scene;
  this.cameara;
  this.renderer;
  this.coin;
  this.coinBorder;
  this.gl;
  this.animationFrame;
  this.rotationY = 0;
  this.textureMaterial;
  this.coinPositionY = 0;
  this.loadInterAd;

  const that = this;

  useEffect(() => {
    admob()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      })
      .then(res => {
        // Request config successfully set!
      });

    const eventListener = interstitialAd.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        that.loadInterAd = true;
        console.log('load front ad success', that.loadInterAd);
        // setLoaded(true);
      }
      if (type === AdEventType.CLOSED) {
        that.loadInterAd = false;
        console.log('load front ad close', that.loadInterAd);
        // setLoaded(false);

        interstitialAd.load();
      }
    });
    interstitialAd.load();

    return () => {
      eventListener();
    };
  }, []);

  // if (!loaded) {
  //   return null;
  // }

  useEffect(() => {
    THREE.suppressExpoWarnings();

    const coinNameList = _.chain(marketAllList)
      .filter(marketAllInfo => {
        return _.includes(marketAllInfo.market, 'KRW');
      })
      .map(marketAllInfo => {
        return _.replace(marketAllInfo.market, 'KRW-', '');
      })
      .value();
    setCoinsNameArr(coinNameList);
  }, []);

  // detail animation
  const AnimatedView = animated(View);
  const detailAnimation = useSpring({bottom: isDetailOpen ? '15%' : '0%'});
  const detailSubAnimation = useSpring({bottom: isDetailOpen ? '25%' : '0%'});
  const detailLottieAnimation = useSpring({
    bottom: isDetailOpen ? '35%' : '0%',
  });

  const detailWidthAnimation = useSpring({
    width: isDetailOpen ? '80%' : '100%',
  });
  const detailHeightAnimation = useSpring({
    height: isDetailOpen ? '80%' : '100%',
  });
  const detailSubWidthAnimation = useSpring({
    width: isDetailOpen ? '40%' : '50%',
  });
  const detailSubHeightAnimation = useSpring({
    height: isDetailOpen ? '20%' : '25%',
  });

  // three js context 세팅
  const onContextCreate = gl => {
    const {
      scale: pixelRatio,
      drawingBufferWidth: width,
      drawingBufferHeight: height,
    } = gl;

    that.gl = gl;
    that.gl.canvas = {width, height};
    that.scene = new THREE.Scene();
    that.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    that.camera.position.set(0, 0, 20);
    that.camera.lookAt(this.scene.position);

    // 동전 형상 생성 (원통 모양)
    const cylinderGeometry = new THREE.CylinderGeometry(
      3.7, // 상단 원통의 반지름
      3.7, // 하단 원통의 반지름
      0.3, // 원통의 높이
      50, // 원통의 원주 주위에 분핟뢴 면의 수
      5, // 원통 높이에 따른 면의 행 수
      false, // 끝이 열려있는지 닫혀있는지 여부
    );

    cylinderGeometry.rotateX(Math.PI / 2);

    // 동전 가운데 형상 생성
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, 4, 0, Math.PI * 2, 0, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 3.7, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    // 동전 테두리 형상 생성
    const borderGeometry = new THREE.ExtrudeBufferGeometry(arcShape, {
      depth: 0.5,
      steps: 1,
      bevelEnabled: false,
      curveSegments: 50,
    });

    borderGeometry.translate(0, 0, -0.25);

    // 동전 제질 생성
    const coinMeterial = new THREE.MeshPhongMaterial({
      color: 0xffee7e,
      specular: 0x5b5b5b,
      shininess: 50,
      flatShading: THREE.SmoothShading,
    });

    // 동전 테두리 재질 생성
    const coinBorderMeterial = new THREE.MeshPhongMaterial({
      color: 0xffee7e,
      specular: 0x5b5b5b,
      shininess: 50,
      flatShading: THREE.SmoothShading,
    });

    // 기본 이미지 세팅
    new ExpoTHREE.TextureLoader().load(require('../img/RCRC.png'), texture => {
      texture.center.set(0.5, 0.5);
      texture.rotation = THREE.MathUtils.degToRad(90);

      that.textureMaterial = new THREE.MeshPhongMaterial({
        color: 0xffee7e,
        specular: 0x5b5b5b,
        shininess: 50,
        transparent: true,
        map: texture,
      });
      const backTextureMaterial = new THREE.MeshPhongMaterial({
        color: 0xffee7e,
        specular: 0x5b5b5b,
        shininess: 50,
        transparent: true,
        map: texture,
      });

      that.textureMaterial.needsUpdate = true;
      that.textureMaterial.map.needsUpdate = true;

      that.coin = new THREE.Mesh(cylinderGeometry, [
        coinMeterial,
        that.textureMaterial,
        backTextureMaterial,
      ]);

      that.coinBorder = new THREE.Mesh(borderGeometry, coinBorderMeterial);
      that.coin.position.set(0, that.coinPositionY, 0);
      that.coinBorder.position.set(0, that.coinPositionY, 0);

      that.scene.add(that.coin);
      that.scene.add(that.coinBorder);

      // create light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      const leftPointLight = new THREE.DirectionalLight(0xffffff, 0.5);
      const rightPointLight = new THREE.DirectionalLight(0xffffff, 0.1);
      const skyLight = new THREE.DirectionalLight(0xffffff, 0.5);

      leftPointLight.position.set(-30, 0, 0);
      rightPointLight.position.set(30, 0, 0);
      skyLight.position.set(0, 30, 0);

      that.scene.add(skyLight);
      that.scene.add(leftPointLight);
      that.scene.add(rightPointLight);
      that.scene.add(ambientLight);

      // create renderer
      that.renderer = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});

      that.renderer.setSize(width, height);
      that.renderer.render(that.scene, that.camera);

      that.gl.endFrameEXP();

      setIstexture(true);
      setLoadingOpacity(0);
      setTwinkleOpacity(1);
    });
  };

  // 동전 회전 애니메이션
  const animate = () => {
    that.animationFrame = requestAnimationFrame(animate);

    if (!that.changeTexture) {
      that.coin.rotation.y += that.rotationY;
      that.coinBorder.rotation.y += that.rotationY;
      that.renderer.render(that.scene, that.camera);
    }

    if (that.changeTexture) {
      that.rotationY = THREE.MathUtils.lerp(that.rotationY, 0, 0.01);
      that.coin.rotation.y = that.rotationY;
      that.coinBorder.rotation.y = that.rotationY;
      that.renderer.render(that.scene, that.camera);

      if (_.floor(that.rotationY, 2) === -2.3) {
        that.textureMaterial.dispose(); // 텍스쳐 교체를 위한 기존 텍스쳐 삭제

        // 이미지 load
        that.changeTexture.center.set(0.5, 0.5);
        that.changeTexture.rotation = THREE.MathUtils.degToRad(90);
        that.textureMaterial.map = that.changeTexture;
      }

      // lottie animation start
      if (_.floor(that.rotationY, 2) === -0.15) {
        cancelAnimationFrame(that.animationFrame);

        AsyncStorage.getItem('stackName').then(result => {
          // console.log('Spin ==>', result);
          // if ('Spin' === _.toString(result)) {
          that.animation.play();
          resultSound.play();
          // } else {
          // return false;
          // }
        });

        if (_.isUndefined(that.selectedCoin)) {
          that.selectedCoin = 'RETRY';
        }

        setSelectedCoinName(that.selectedCoin);
        setSelectedCoinInfo(that.selectedCoinInfo);
        setDetailBtnOpacity(0.9);
        setTitleOpacity(1);

        if (!_.isUndefined(that.selectedCoin)) {
          // 데이터 요청
          reqUpbitCandlesList({
            unit: 'minutes',
            minute: 60,
            payment: 'KRW',
            coinName: that.selectedCoin,
            count: 24,
          });
          reqUpbitTickerList({
            payment: 'KRW',
            coinName: that.selectedCoin,
          });

          reqUpbitOrderBookList({
            payment: 'KRW',
            coinName: that.selectedCoin,
          });
        }
        that.rotationY = 0;

        console.log('@@@', that.loadInterAd);
        if (
          !_.chain(100).random().divide(7).toString().includes('.').value() &&
          that.loadInterAd
        ) {
          interstitialAd.show();
        }
      }
    }

    that.gl.endFrameEXP();
  };

  // 터치 이벤트
  const spinCoin = () => {
    if (isDetailOpen) {
      setIsDetailOpen(false);
      setDetailBtnOpacity(0.9);
      setBannerOpacity(1);
    }
    cancelAnimationFrame(that.animationFrame);

    if (isTexture && !isDetailOpen) {
      that.changeTexture = null;

      const randomNumber = _.random(0, _.size(coinsNameArr));

      that.path = coinUrlInfo[coinsNameArr[randomNumber]]
        ? coinUrlInfo[coinsNameArr[randomNumber]]
        : require('../img/RCRC.png');

      const coinName = coinsNameArr[randomNumber];
      const coinInfo = _.find(marketAllList, info => {
        return _.includes(info.market, coinName);
      });

      new ExpoTHREE.TextureLoader().load(that.path, texture => {
        if (_.isNull(that.changeTexture)) {
          that.selectedCoin = coinName;
          that.selectedCoinInfo = coinInfo;
          that.changeTexture = texture;
          console.log('@@ selected Coin  ==>', that.selectedCoin);
        }
      });

      that.rotationY = -180; // 회전 방향을 정함.
      spinSound.play().setCurrentTime(0);
      animate();
    }
  };

  return (
    <SafeAreaProvider
      style={{
        width: screenWidth,
        height: screenHeight,
        alignItems: 'center',
        backgroundColor: '#309cff',
      }}>
      {/* 해더 영역 */}
      {/* <MyHeader /> */}
      {/* 로딩 영역 */}
      <AnimatedView
        style={{width: '100%', height: '100%', alignItems: 'center'}}>
        <View style={styles.loadingView}></View>
        {/* 메인 동정 영역 */}
        <AnimatedView
          style={[
            detailAnimation,
            detailWidthAnimation,
            detailHeightAnimation,
          ]}>
          <GLView
            style={{
              flex: 1,
            }}
            onContextCreate={onContextCreate}
          />
        </AnimatedView>
        {/* 정해진 코인 이름 영역 */}
        <Animated.View style={[styles.coinTitleView, {opacity: titleOpacity}]}>
          {/* <Text style={styles.coinTitle}>{selectedCoinName}</Text> */}
        </Animated.View>
        {/* 코인 반짝반짝 로띠 영역 */}
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          progress={1}
          style={{
            position: 'absolute',
          }}
          source={require('../lottie/squib.json')}
          loop={false}
        />
        {/* 코인 빠밤 로띠 영역 */}
        <AnimatedView
          style={[
            detailLottieAnimation,
            detailWidthAnimation,
            detailHeightAnimation,
            {
              position: 'absolute',
            },
          ]}>
          <LottieView
            ref={twinkleLottie => {
              this.twinkleLottie = twinkleLottie;
            }}
            style={{
              opacity: twinkleOpacity,
            }}
            source={require('../lottie/twinkle.json')}
            autoPlay
            loop={true}
          />
        </AnimatedView>
        <AnimatedView
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            // top: '38%',
          }}>
          <DetailView
            isDetailView={isDetailOpen}
            coinInfo={selectedCoinInfo}
            candlesList={candlesList}
            tickerList={tickerList}
            orderBookList={orderBookList}
          />
        </AnimatedView>
        {/* 터치 영역 제한을 위한 영역 */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
          <Button
            style={
              (styles.detailButton,
              [
                {
                  opacity: 0,
                  height: 20,
                  marginTop: 20,
                  color: 'white',
                  width: 50,
                },
              ])
            }
            title="HI"></Button>
          <AnimatedView
            onTouchStart={spinCoin}
            style={[
              detailSubAnimation,
              detailSubWidthAnimation,
              detailSubHeightAnimation,
              {
                opacity: 0.5,
                margin: 10,
                // backgroundColor: 'gray',
              },
            ]}></AnimatedView>
          <Animated.View
            style={{
              opacity: detailBtnOpacity,
            }}>
            {/* detail 버튼 */}
            <TouchableOpacity
              style={[styles.detailButton]}
              onPress={() => {
                console.log(that.selectedCoin);
                if (that.rotationY === 0) {
                  if (that.selectedCoin !== 'RETRY') {
                    setIsDetailOpen(!isDetailOpen);
                    setDetailBtnOpacity(0);
                    setBannerOpacity(0);
                  } else {
                    Alert.alert('', 'Please Try Spin Again!');
                  }
                }
              }}>
              <LottieView
                style={{width: 40}}
                source={require('../lottie/detailArrow.json')}
                loop={true}
                autoPlay
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={[styles.bannerView, {opacity: bannaerOpacity}]}>
          <BannerAd
            // unitId={TestIds.BANNER}
            unitId={'ca-app-pub-8566072639292145/1537388587'}
            size={BannerAdSize.BANNER}
            onAdLoaded={e => {
              console.log('Advert loaded');
            }}
            onAdFailedToLoad={e => {
              console.log('Fail ad: ', e);
            }}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </AnimatedView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  unableButton: {
    backgroundColor: 'transparent',
  },
  coinTitleView: {
    width: '100%',
    position: 'absolute',
    top: '29%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinTitle: {
    // color: 'white',
    paddingHorizontal: 20,
    backgroundColor: '#2980b9',
    borderWidth: 2,
    borderColor: 'gold',
    padding: 3,
    color: 'gold',
    fontWeight: 'bold',
  },
  squibView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  touchView: {},
  bannerView: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '10%',
    shadowOpacity: 0.7,
    shadowOffset: {width: 0, height: 1},
    // backgroundColor: 'white',
    // borderWidth: 3,
    // borderRadius: 5,
    // borderColor: '#2980b9',
  },
  loadingView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    width: '30%',
    // marginLeft: 5,
    // marginBottom: 7,
  },
  coinInfoFont: {
    color: 'white',
  },
  detailButton: {},
});

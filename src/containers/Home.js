import React, {useRef, useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {useSelector, useDispatch} from 'react-redux';
import {Text, Button} from 'react-native-elements';
import Sound from 'react-native-sound';
import _ from 'lodash';
import LottieView from 'lottie-react-native';
import admob, {
  BannerAd,
  TestIds,
  BannerAdSize,
  MaxAdContentRating,
  firebase,
} from '@react-native-firebase/admob';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSpring, animated} from '@react-spring/native';

import MyHeader from '../components/MyHeader';
import coinUrlInfo from './coinUrlInfo';
import DetailView from '../components/DetailView';
import {getBithumbOrderBookInfo} from '../modules/bithumb/bithumbOrderBook';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export default function Home() {
  // state
  const [bithumbCoinsInfo, setBitHumbCoinsInfo] = useState({});
  const [selectedCoinName, setSelectedCoinName] = useState('');
  const [selectedCoinInfo, setSelectedCoinInfo] = useState({});
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [isTexture, setIstexture] = useState(false);
  const [loadingOpacity, setLoadingOpacity] = useState(1);
  const [twinkleOpacity, setTwinkleOpacity] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailBtnOpacity, setDetailBtnOpacity] = useState(0);

  const resultSound = new Sound(require('../sound/result.mp3')); // 결과 사운드
  const spinSound = new Sound(require('../sound/spin.mp3')); // 터치 순간 사운드

  // bithumb 데이터 요청 결과
  const {tickerInfo} = useSelector(state => state.bithumbTicker);
  const {orderBookInfo} = useSelector(state => state.bithumbOrderBook);

  // dispatch
  const dispatch = useDispatch();
  // bithumb orderbook 요청
  const reqBithumbOrderBookInfo = useCallback(
    params => {
      dispatch(getBithumbOrderBookInfo(params));
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

    THREE.suppressExpoWarnings();
    setBitHumbCoinsInfo(tickerInfo.data);
  }, []);

  // TODO: detail animation
  const AnimatedView = animated(View);
  const detailAnimation = useSpring({bottom: isDetailOpen ? '18%' : '0%'});

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
    that.camera.position.set(0, 2, 20);
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
          console.log('@@ result==>', result);
          if ('Spin' === _.toString(result)) {
            that.animation.play();
            resultSound.play();
          } else {
            return false;
          }
        });

        if (
          that.selectedCoin === 'undefined' ||
          that.selectedCoin === 'date' ||
          that.selectedCoin === 'date' ||
          !that.selectedCoin
        ) {
          that.selectedCoin = 'RETRY';
        }

        // TODO: 데이터 요청
        setSelectedCoinName(that.selectedCoin);
        setSelectedCoinInfo(that.selectedCoinInfo);
        reqBithumbOrderBookInfo({coinName: that.selectedCoin, payment: 'KRW'});
        setTitleOpacity(1);
        setDetailBtnOpacity(1);
      }
    }

    that.gl.endFrameEXP();
  };

  // 터치 이벤트
  const spinCoin = () => {
    if (isDetailOpen) {
      setIsDetailOpen(false);
      setDetailBtnOpacity(1);
    }
    cancelAnimationFrame(that.animationFrame);

    if (isTexture && !isDetailOpen) {
      that.changeTexture = null;

      const randomNumber = _.random(0, _.size(bithumbCoinsInfo));
      const coinKeyArr = _.keys(bithumbCoinsInfo);

      that.path = coinUrlInfo[coinKeyArr[randomNumber]]
        ? coinUrlInfo[coinKeyArr[randomNumber]]
        : require('../img/RCRC.png');

      const coinName = coinKeyArr[randomNumber];
      const coinInfo = bithumbCoinsInfo[coinName];

      new ExpoTHREE.TextureLoader().load(that.path, texture => {
        if (_.isNull(that.changeTexture)) {
          that.selectedCoin = coinName;
          that.selectedCoinInfo = coinInfo;

          console.log(that.selectedCoin);
          that.changeTexture = texture;
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
        backgroundColor: '#5fbaff',
      }}>
      {/* 해더 영역 */}
      {/* <MyHeader /> */}
      {/* 로딩 영역 */}
      <AnimatedView
        style={[
          detailAnimation,
          {
            width: '100%',
            height: '100%',
            // bottom: '0%', // xFIXME:
          },
        ]}>
        <View style={styles.loadingView}></View>
        {/* 메인 동정 영역 */}

        <GLView
          style={{
            display: 'flex',
            flex: 1,
          }}
          onContextCreate={onContextCreate}
        />
        {/* 정해진 코인 이름 영역 */}
        <Animated.View style={[styles.coinTitleView, {opacity: titleOpacity}]}>
          <Text style={styles.coinTitle}>{selectedCoinName}</Text>
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
        <LottieView
          ref={twinkleLottie => {
            this.twinkleLottie = twinkleLottie;
          }}
          style={{
            position: 'absolute',
            opacity: twinkleOpacity,
          }}
          source={require('../lottie/twinkle.json')}
          autoPlay
          loop={true}
        />
        {/* <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <View
        style={{
          width: '85%',
          height: '20%',
          marginTop: 400,
          backgroundColor: 'black',
          borderRadius: 10,
          flexDirection: 'row',
          opacity: 0.4,
        }}>
        <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: 'space-between',
          color: 'white',
        }}>
        <Text style={styles.coinInfoFont}>
        시가 {selectedCoinInfo['opening_price']}
        </Text>
        <Text style={styles.coinInfoFont}>test1</Text>
        <Text style={styles.coinInfoFont}>test1</Text>
        <Text style={styles.coinInfoFont}>test1</Text>
        <Text style={styles.coinInfoFont}>test1</Text>
        </View>
        <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: 'space-between',
          color: 'white',
        }}>
        <Text>test1</Text>
        <Text>test1</Text>
        <Text>test1</Text>
        <Text>test1</Text>
        <Text>test1</Text>
        </View>
        </View>
      </View> */}
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
            style={(styles.detailButton, [{opacity: 0}])}
            title="fakeArea"></Button>
          <View onTouchStart={spinCoin} style={styles.touchView}></View>
          <Animated.View style={{opacity: detailBtnOpacity}}>
            <Button
              style={[styles.detailButton]}
              title="DETAIL"
              onPress={() => {
                setIsDetailOpen(!isDetailOpen);
                setDetailBtnOpacity(0);
              }}></Button>
          </Animated.View>
          <DetailView />
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
  touchView: {
    width: '50%',
    height: '25%',
    opacity: 0.5,
    margin: 10,
    backgroundColor: 'gray',
  },
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

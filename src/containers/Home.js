import React, {useRef, useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet, Animated, Image} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {useSelector} from 'react-redux';
import {Header, Text} from 'react-native-elements';
import Sound from 'react-native-sound';
import _ from 'lodash';
import LottieView from 'lottie-react-native';

import coinUrlInfo from './coinUrlInfo';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export default function Home() {
  const [bithumbCoinsInfo, setBitHumbCoinsInfo] = useState({});
  const [selectedCoinName, setSelectedCoinName] = useState();
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [isTexture, setIstexture] = useState(false);

  const resultSound = new Sound(require('../sound/result.mp3'));
  const spinSound = new Sound(require('../sound/spin.mp3'));

  const {resInfo} = useSelector(state => state.bithumb);

  this.scene;
  this.cameara;
  this.renderer;
  this.coin;
  this.coinBorder;
  this.gl;

  this.animationFrame;
  this.rotationY = 0;

  this.textureMaterial;

  const that = this;

  useEffect(() => {
    THREE.suppressExpoWarnings();
    setBitHumbCoinsInfo(resInfo.data);
  }, []);

  const onContextCreate = gl => {
    const {
      scale: pixelRatio,
      drawingBufferWidth: width,
      drawingBufferHeight: height,
    } = gl;

    that.gl = gl;
    that.gl.canvas = {width, height};

    that.scene = new THREE.Scene();

    // create camera
    that.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    that.camera.position.set(0, 2, 20);
    that.camera.lookAt(this.scene.position);

    // create coin object
    const cylinderGeometry = new THREE.CylinderGeometry(
      3.7,
      3.7,
      0.3,
      50,
      5,
      false,
    );

    cylinderGeometry.rotateX(Math.PI / 2);

    // create hole
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, 4, 0, Math.PI * 2, 0, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 3.7, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    const borderGeometry = new THREE.ExtrudeBufferGeometry(arcShape, {
      depth: 0.5,
      steps: 1,
      bevelEnabled: false,
      curveSegments: 50,
    });

    borderGeometry.translate(0, 0, -0.25);

    // set coin meterial
    const coinMeterial = new THREE.MeshPhongMaterial({
      color: 0xffee7e,
      specular: 0x5b5b5b,
      shininess: 50,
      flatShading: THREE.SmoothShading,
    });

    const coinBorderMeterial = new THREE.MeshPhongMaterial({
      color: 0xffee7e,
      specular: 0x5b5b5b,
      shininess: 50,
      flatShading: THREE.SmoothShading,
    });

    // load texture
    new ExpoTHREE.TextureLoader().load(
      require('../img/RCRC.png'),
      function (texture) {
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

        textureMaterial.needsUpdate = true;
        textureMaterial.map.needsUpdate = true;

        that.coin = new THREE.Mesh(cylinderGeometry, [
          coinMeterial,
          textureMaterial,
          backTextureMaterial,
        ]);

        that.coinBorder = new THREE.Mesh(borderGeometry, coinBorderMeterial);
        that.coin.position.set(0, 1.5, 0);
        that.coinBorder.position.set(0, 1.5, 0);

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
      },
    );
  };

  const animate = () => {
    that.animationFrame = requestAnimationFrame(animate);
    that.rotationY = THREE.MathUtils.lerp(that.rotationY, 0, 0.01);
    that.coin.rotation.y = that.rotationY;
    that.coinBorder.rotation.y = that.rotationY;
    that.renderer.render(that.scene, that.camera);

    // console.log(_.floor(that.rotationY, 2));
    if (_.floor(that.rotationY, 2) === -2.3) {
      const randomNumber = _.random(0, _.size(bithumbCoinsInfo));
      const coinKeyArr = _.keys(bithumbCoinsInfo);

      that.selectedCoin = coinKeyArr[randomNumber];
      that.textureMaterial.dispose();

      let path = coinUrlInfo[that.selectedCoin];

      if (!path) {
        path = require('../img/RCRC.png');
      }

      that.textureMaterial.map = new ExpoTHREE.TextureLoader().load(
        path,
        texture => {
          texture.center.set(0.5, 0.5);
          texture.rotation = THREE.MathUtils.degToRad(90);
        },
      );
    }

    if (_.floor(that.rotationY, 2) === -0.15) {
      cancelAnimationFrame(that.animationFrame);
      this.animation.play();

      setTimeout(() => {
        resultSound.play();
        setSelectedCoinName(that.selectedCoin);
        setTitleOpacity(1);
      }, 280);
    }

    that.gl.endFrameEXP();
  };

  const spinCoin = () => {
    if (isTexture) {
      that.rotationY = -150;

      cancelAnimationFrame(that.animationFrame);

      spinSound.play().setCurrentTime(0);
      animate();
    }
  };

  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight,
        backgroundColor: '#74b9ff',
      }}>
      <Header
        barStyle="default"
        containerStyle={{
          backgroundColor: 'transparent',
          borderBottomColor: 'transparent',
        }}></Header>
      <GLView
        style={{
          display: 'flex',
          flex: 1,
        }}
        onContextCreate={onContextCreate}
      />
      <Animated.View style={[styles.coinTitleView, {opacity: titleOpacity}]}>
        <Text style={styles.coinTitle}>{selectedCoinName}</Text>
      </Animated.View>
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
        <View onTouchStart={spinCoin} style={styles.touchView}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unableButton: {
    backgroundColor: 'transparent',
  },
  coinTitleView: {
    width: '100%',
    position: 'absolute',
    top: '28%',
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
    backgroundColor: 'transparent',
  },
});

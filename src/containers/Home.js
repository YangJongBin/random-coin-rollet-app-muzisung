import React, {useRef, useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {useSelector} from 'react-redux';
import {Header, Text} from 'react-native-elements';
import _ from 'lodash';
import {ScreenStack} from 'react-native-screens';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export default function Home() {
  const [bithumbCoinsInfo, setBitHumbCoinsInfo] = useState({});
  const [selectedCoinName, setSelectedCoinName] = useState();

  const {resInfo} = useSelector(state => state.bithumb);

  let coinName = '';

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
      require('../img/testBitcoin.png'),
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

        textureMaterial.needsUpdate = true;
        textureMaterial.map.needsUpdate = true;

        that.coin = new THREE.Mesh(cylinderGeometry, [
          coinMeterial,
          textureMaterial,
          new THREE.MeshPhongMaterial({
            color: 0xfcba15,
            specular: 0x5b5b5b,
            shininess: 50,
            transparent: true,
          }),
        ]);

        that.coinBorder = new THREE.Mesh(borderGeometry, coinBorderMeterial);
        that.coin.position.set(0, 2, 0);
        that.coinBorder.position.set(0, 2, 0);

        that.scene.add(that.coin);
        that.scene.add(that.coinBorder);
        // scene.add(new THREE.GridHelper()); // FIXME: 삭제

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
      },
    );
  };

  const animate = () => {
    that.rotationY = THREE.MathUtils.lerp(that.rotationY, 0, 0.01);
    that.coin.rotation.y = that.rotationY;
    that.coinBorder.rotation.y = that.rotationY;
    that.animationFrame = requestAnimationFrame(animate);
    that.renderer.render(that.scene, that.camera);

    console.log(that.rotationY);

    if (_.floor(that.rotationY, 2) === -1.75) {
      console.log('change texture');
      that.textureMaterial.dispose();
      that.textureMaterial.map = new ExpoTHREE.TextureLoader().load(
        require('./bitcoin.png'),
      );
    }

    if (_.floor(that.rotationY, 1) === -0.1) {
      console.log('stop animation');
      cancelAnimationFrame(that.animationFrame);
    }

    that.gl.endFrameEXP();
  };

  const spinCoin = () => {
    const randomNumber = _.random(0, _.size(bithumbCoinsInfo));
    const coinKeyArr = _.keys(bithumbCoinsInfo);
    const selectedCoin = coinKeyArr[randomNumber];

    that.rotationY = -150;

    coinName = selectedCoin;
    // setSelectedCoinName(selectedCoin);
    animate();

    console.log('@@ coinName ==>', coinName);
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
        onTouchStart={spinCoin}
      />
      <View style={styles.coinTitleView}>
        <Text>{selectedCoinName}</Text>
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
    // opacity: 0,
  },
  coinTitle: {
    // color: 'white',
    paddingHorizontal: 20,
    backgroundColor: '#2980b9',
    // fontWeight: 'bold',
  },
});

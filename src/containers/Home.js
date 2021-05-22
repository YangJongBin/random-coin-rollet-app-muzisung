import React, {useRef, useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {
  Header,
  Button,
  Tooltip,
  Text,
  CheckBox,
  SpeedDial,
  FAB,
} from 'react-native-elements';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

export default function Home() {
  const [isOpenSpeedDial, setOpenSpeedDial] = useState(false);
  let rotationY = 0;

  useEffect(() => {
    THREE.suppressExpoWarnings();
  }, []);

  const onContextCreate = gl => {
    const {
      scale: pixelRatio,
      drawingBufferWidth: width,
      drawingBufferHeight: height,
    } = gl;

    gl.canvas = {width, height};

    // create scene
    const scene = new THREE.Scene();

    // create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    camera.position.set(0, 2, 20);
    camera.lookAt(scene.position);

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

    const logoTexture = new ExpoTHREE.TextureLoader().load(
      require('../img/testBitcoin.png'),
    );

    logoTexture.center.set(0.5, 0.5);
    logoTexture.rotation = THREE.MathUtils.degToRad(90);

    const coin = new THREE.Mesh(cylinderGeometry, [
      coinMeterial,
      new THREE.MeshPhongMaterial({
        color: 0xffee7e,
        specular: 0x5b5b5b,
        shininess: 50,
        transparent: true,
        map: logoTexture,
      }),

      new THREE.MeshPhongMaterial({
        color: 0xfcba15,
        specular: 0x5b5b5b,
        shininess: 50,
        transparent: true,
      }),
    ]);
    const coinBorder = new THREE.Mesh(borderGeometry, coinBorderMeterial);

    coin.position.set(0, 2, 0);
    coinBorder.position.set(0, 2, 0);

    scene.add(coin);
    scene.add(coinBorder);
    // scene.add(new THREE.GridHelper()); // FIXME: 삭제

    // create light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const leftPointLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const rightPointLight = new THREE.DirectionalLight(0xffffff, 0.1);
    const skyLight = new THREE.DirectionalLight(0xffffff, 0.5);

    leftPointLight.position.set(-30, 0, 0);
    rightPointLight.position.set(30, 0, 0);
    skyLight.position.set(0, 30, 0);

    scene.add(skyLight);
    scene.add(leftPointLight);
    scene.add(rightPointLight);
    scene.add(ambientLight);

    // create renderer
    const renderer = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});

    renderer.setSize(width, height);
    renderer.render(scene, camera);

    gl.endFrameEXP();

    // set animation
    const animate = () => {
      rotationY = THREE.MathUtils.lerp(rotationY, 0, 0.01);

      coin.rotation.y = rotationY;
      coinBorder.rotation.y = rotationY;

      requestAnimationFrame(animate);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  const spinCoin = () => {
    rotationY = -150;
  };

  const stopCoin = () => {};

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
        }}>
        {/* <Button buttonStyle={styles.unableButton}></Button> */}
        {/* <Button buttonStyle={styles.unableButton}></Button> */}
        {/* <Button buttonStyle={styles.unableButton}></Button> */}
      </Header>
      <GLView
        style={{
          display: 'flex',
          flex: 1,
        }}
        onContextCreate={onContextCreate}
        onTouchStart={spinCoin}
      />
      <View style={styles.coinTitleView}>
        <Text h4 style={styles.coinTitle}>
          BTC
        </Text>
        {/* <Button title={'BTC'}></Button> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unableButton: {
    backgroundColor: 'transparent',
  },
  coinTitleView: {
    // backgroundColor: 'red',r
    width: '100%',
    position: 'absolute',
    top: '28%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  coinTitle: {
    // color: 'white',
    paddingHorizontal: 20,
    // backgroundColor: '#2980b9',
    // fontWeight: 'bold',
  },
});

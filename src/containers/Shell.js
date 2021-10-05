import React, {Component} from 'react';
import {Text, StyleSheet, Dimensions, View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TTS from 'react-native-tts';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import LottieView from 'lottie-react-native';
import _, {last} from 'lodash';
import * as CANNON from 'cannon';

import MyHeader from '../components/MyHeader';
import coinUrlInfo from './coinUrlInfo';
import {scaleLongestSideToSize} from 'expo-three/build/utils';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');

TTS.setDefaultLanguage('ko-KR');
TTS.addEventListener('tts-start');
TTS.addEventListener('tts-finish');
TTS.addEventListener('tts-cancel');

const that = this;

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

  // FIXME: delete
  const gridHelper = new THREE.GridHelper(10, 10);
  that.scene.add(gridHelper);

  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.y = 1;
  // cube.position.z = 1;
  // scene.add(cube);

  // TODO: cannon test
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  // TODO:
  const groundMaterial = new CANNON.Material();
  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: groundMaterial,
    position: new CANNON.Vec3(0, 0, 0),
  });
  groundBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2,
  );
  world.add(groundBody);
  // TODO:
  const objects = [];
  const ballMaterial = new THREE.MeshPhongMaterial();
  const ballPysicsMaterial = new CANNON.Material();

  world.addContactMaterial(
    new CANNON.ContactMaterial(groundMaterial, ballPysicsMaterial, {
      restitution: 0.7,
      friction: 0.6,
    }),
  );
  // TODO:
  that.renderer = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});
  that.renderer.setSize(width, height);
  that.renderer.render(that.scene, that.camera);

  that.gl.endFrameEXP();
};
export default class Shell extends Component {
  _onTTS = () => {
    TTS.stop();
    // TODO: TTS
    // TTS.speak('B');
    // TTS.speak('T');
    // TTS.speak('C');
  };

  render() {
    return (
      <SafeAreaProvider
        style={{
          width: screenWidth,
          height: screenHeight,
          backgroundColor: '#5fbaff',
        }}>
        <MyHeader />
        <GLView
          style={{
            display: 'flex',
            flex: 1,
          }}
          onContextCreate={onContextCreate}
        />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({});

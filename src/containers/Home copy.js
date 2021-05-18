import React, {useRef, useState} from 'react';
import {View, Animated} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {Dimensions} from 'react-native';
import {ReinhardToneMapping} from 'three';
import {Canvas} from '@react-three/fiber';
import {useSpring, animated} from '@react-spring/three';

export default function Home() {
  const ref = useRef();
  const [test, setTest] = useState(0);

  const onContextCreate = gl => {
    const {
      canvas,
      scale: pixelRatio,
      drawingBufferWidth: width,
      drawingBufferHeight: height,
    } = gl;

    this.gl = gl;

    this.gl.canvas = {width, height};

    this.renderer = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const d = 1;
    const aspect = width / height;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000,
    );
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(this.scene.position);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const meterial = new THREE.MeshPhongMaterial({
      color: 0xff8888,
    });

    this.cube = new THREE.Mesh(geometry, meterial);

    this.scene.add(this.cube);
    this.scene.add(new THREE.AmbientLight(0x4000ff));

    const light = new THREE.PointLight(0xffffff, 6, 40);
    light.position.set(10, 20, 15);

    this.scene.add(light);

    const animate = () => {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
      this.gl.endFrameEXP();
    };

    animate();
  };

  return (
    <Animated.View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <GLView
        ref={ref}
        style={{width: test ? 300 : 300, height: 300}}
        onContextCreate={onContextCreate}
      />
    </Animated.View>
  );
}

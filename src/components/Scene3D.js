import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Joystick from './Joystick';
import DesktopControls from './DesktopControls';
import { isMobile } from 'react-device-detect';

const Scene3D = ({ onLoad }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 1.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new PointerLockControls(camera, renderer.domElement);
    controlsRef.current = controls;
    scene.add(controls.getObject());

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const loader = new GLTFLoader();

    const baseUrl = 'https://cdn.jsdelivr.net/gh/emmanuelw21/wetdrydigital';

    loader.load(
      `${baseUrl}/static/environment.glb`,
      (gltf) => {
        scene.add(gltf.scene);
        setIsLoading(false);
        if (onLoad) onLoad();
      },
      (progress) => console.log('Loading environment...', (progress.loaded / progress.total * 100).toFixed(2), '%'),
      (error) => console.error('Error loading environment:', error)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      const mountCurrent = mountRef.current;
      if (mountCurrent) {
        mountCurrent.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoad]);

  const handleJoystickMove = (joystickId, movement) => {
    if (!controlsRef.current) return;

    const speed = 0.05;
    const controls = controlsRef.current;

    if (joystickId === 'left') {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(controls.getObject().quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(controls.getObject().quaternion);

      controls.getObject().position.add(forward.multiplyScalar(-movement.deltaY * speed));
      controls.getObject().position.add(right.multiplyScalar(movement.deltaX * speed));
    } else if (joystickId === 'right') {
      controls.getObject().rotation.y -= movement.deltaX * 0.02;
      controls.getObject().children[0].rotation.x -= movement.deltaY * 0.02;
      controls.getObject().children[0].rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.getObject().children[0].rotation.x));
    }
  };

  const handleVerticalMovement = (direction, pressed) => {
    if (!controlsRef.current) return;

    const speed = 0.1;
    const controls = controlsRef.current;

    if (direction === 'up' && pressed) {
      controls.getObject().position.y += speed;
    } else if (direction === 'down' && pressed) {
      controls.getObject().position.y -= speed;
    }
  };

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      {!isLoading && isMobile && (
        <>
          <Joystick id="left" onMove={(movement) => handleJoystickMove("left", movement)} />
          <Joystick id="right" onMove={(movement) => handleJoystickMove("right", movement)} />
          <button
            style={{position: 'absolute', left: '10px', bottom: '120px', width: '60px', height: '60px'}}
            onTouchStart={() => handleVerticalMovement('down', true)}
            onTouchEnd={() => handleVerticalMovement('down', false)}
          >
            ▼
          </button>
          <button
            style={{position: 'absolute', right: '10px', bottom: '120px', width: '60px', height: '60px'}}
            onTouchStart={() => handleVerticalMovement('up', true)}
            onTouchEnd={() => handleVerticalMovement('up', false)}
          >
            ▲
          </button>
        </>
      )}
      {!isLoading && !isMobile && <DesktopControls controlsRef={controlsRef} />}
    </>
  );
};

export default Scene3D;

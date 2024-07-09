import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Joystick from './Joystick';
import DesktopControls from './DesktopControls';
import { isMobile } from 'react-device-detect';

const Scene3D = ({ onLoad }) => {
  // UNCHANGED: Ref and state declarations
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  // UPDATED: Increased initial mobile speed for more noticeable effect
  const [mobileSpeed, setMobileSpeed] = useState(0.1);
  const [lastTouchX, setLastTouchX] = useState(null);
  const [lastTouchY, setLastTouchY] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // UNCHANGED: Scene setup code
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

    const baseUrl = 'https://wetdrydigital.netlify.app';

    console.log("Attempting to load environment from:", `${baseUrl}/environment.glb`);

    loader.load(
      `${baseUrl}/environment.glb`,
      (gltf) => {
        scene.add(gltf.scene);
        setIsLoading(false);
        console.log("Environment loaded successfully");
        if (onLoad) {
          onLoad();
          console.log("onLoad callback called");
        }
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

  // UPDATED: handleJoystickMove to use the new mobileSpeed
  const handleJoystickMove = (movement) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(controls.getObject().quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(controls.getObject().quaternion);

    controls.getObject().position.add(forward.multiplyScalar(-movement.deltaY * mobileSpeed));
    controls.getObject().position.add(right.multiplyScalar(movement.deltaX * mobileSpeed));
  };

  // UPDATED: handleTouchRotation for free camera movement
  const handleTouchRotation = (event) => {
    event.preventDefault();
    if (!controlsRef.current) return;

    const touch = event.touches[0];
    if (lastTouchX === null) {
      setLastTouchX(touch.clientX);
      setLastTouchY(touch.clientY);
      return;
    }

    const deltaX = touch.clientX - lastTouchX;
    const deltaY = touch.clientY - lastTouchY;

    const rotationSpeed = 0.002;
    controlsRef.current.getObject().rotation.y -= deltaX * rotationSpeed;
    controlsRef.current.getObject().children[0].rotation.x -= deltaY * rotationSpeed;

    // Removed the clamp to allow full 360-degree rotation
    setLastTouchX(touch.clientX);
    setLastTouchY(touch.clientY);
  };

  // UNCHANGED: handleTouchEnd function
  const handleTouchEnd = () => {
    setLastTouchX(null);
    setLastTouchY(null);
  };

  // UPDATED: handleVerticalMovement to use new mobileSpeed
  const handleVerticalMovement = (direction, pressed) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    const moveVertical = (event) => {
      if (event) event.preventDefault();
      if (direction === 'up') {
        controls.getObject().position.y += mobileSpeed;
      } else if (direction === 'down') {
        controls.getObject().position.y -= mobileSpeed;
      }
    };

    if (pressed) {
      moveVertical();
      const intervalId = setInterval(moveVertical, 16);
      return () => clearInterval(intervalId);
    }
  };

  // UPDATED: Settings component for better mobile interaction
  const Settings = () => (
    <div style={{position: 'absolute', top: '70px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px', touchAction: 'none'}}>
      <h3 style={{color: 'white'}}>Settings</h3>
      <label style={{color: 'white', display: 'block', marginBottom: '10px'}}>
        Speed: {mobileSpeed.toFixed(2)}
      </label>
      <input 
        type="range" 
        min="0.02" 
        max="0.2" 
        step="0.02"
        value={mobileSpeed}
        onChange={(e) => setMobileSpeed(parseFloat(e.target.value))}
        style={{width: '100%', touchAction: 'none'}}
      />
    </div>
  );

  // UPDATED: Render method to include loading indicator and improved mobile controls
  return (
    <>
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '100vh' }}
        onTouchMove={handleTouchRotation}
        onTouchEnd={handleTouchEnd}
      />
      {isLoading ? (
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '24px'}}>
          Loading 3D Scene...
        </div>
      ) : (
        <>
          {isMobile ? (
            <>
              <Joystick id="left" onMove={handleJoystickMove} />
              <button
                style={{position: 'absolute', left: '10px', bottom: '120px', width: '60px', height: '60px', userSelect: 'none', WebkitUserSelect: 'none'}}
                onTouchStart={(e) => {e.preventDefault(); handleVerticalMovement('down', true)}}
                onTouchEnd={() => handleVerticalMovement('down', false)}
              >
                ▼
              </button>
              <button
                style={{position: 'absolute', right: '10px', bottom: '120px', width: '60px', height: '60px', userSelect: 'none', WebkitUserSelect: 'none'}}
                onTouchStart={(e) => {e.preventDefault(); handleVerticalMovement('up', true)}}
                onTouchEnd={() => handleVerticalMovement('up', false)}
              >
                ▲
              </button>
              <button
                style={{position: 'absolute', right: '10px', top: '10px', width: '50px', height: '50px', fontSize: '24px', background: 'rgba(255,255,255,0.5)', borderRadius: '25px'}}
                onTouchStart={(e) => {e.preventDefault(); setShowSettings(!showSettings)}}
              >
                ⚙️
              </button>
              {showSettings && <Settings />}
            </>
          ) : (
            <DesktopControls controlsRef={controlsRef} />
          )}
        </>
      )}
    </>
  );
};

export default Scene3D;
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Avatar from '../components/Avatar';
import BaseModel from '../components/BaseModel';
import ThirdPersonControls from '../components/ThirdPersonControls';
import ControlsOverlay from '../components/ControlsOverlay';

const IndexPage = () => {
  const avatarRef = useRef();

  return (
    <>
      <Canvas style={{ height: '100vh', width: '100vw' }} backgroundColor="lightblue">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <BaseModel url="/models/environment.glb" />
        <Avatar url="/models/face.glb" ref={avatarRef} />
        <ThirdPersonControls avatarRef={avatarRef} maxHeight={10} />
      </Canvas>
      <ControlsOverlay />
    </>
  );
};

const controlsOverlayStyle = {
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  zIndex: 1000,
};

const joystickStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const joystickKnobStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
};

export default IndexPage;

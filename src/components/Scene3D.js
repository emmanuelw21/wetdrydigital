import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ThirdPersonControls from './ThirdPersonControls';
import Avatar from './Avatar';
import BaseModel from './BaseModel';

function Scene3D() {
  const avatarRef = useRef();

  return (
    <Canvas style={{ height: '100vh', width: '100vw' }} backgroundColor="lightblue">
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <BaseModel url="https://emmanuelw21.github.io/3d/models/environment.glb" />
      <Avatar url="https://emmanuelw21.github.io/3d/models/face.glb" ref={avatarRef} />
      <ThirdPersonControls avatarRef={avatarRef} maxHeight={10} />
    </Canvas>
  );
}

export default Scene3D;
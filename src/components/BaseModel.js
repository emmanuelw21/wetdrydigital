import React from 'react';
import { useGLTF } from '@react-three/drei';

function BaseModel({ url }) {
  const { scene } = useGLTF(url);
  return scene ? <primitive object={scene} /> : null;
}

export default BaseModel;

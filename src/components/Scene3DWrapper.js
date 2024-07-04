import React from 'react';
import Scene3D from './Scene3D';

const Scene3DWrapper = () => {
  if (typeof window !== 'undefined') {
    return <Scene3D />;
  }
  return null;
};

export default Scene3DWrapper;
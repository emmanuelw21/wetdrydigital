import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import LoadingScreen from '../components/LoadingScreen';
import ThirdPersonControls from '../components/ThirdPersonControls';

const Scene3D = loadable(() => import('../components/Scene3D'), {
  fallback: <LoadingScreen />,
});

const IndexPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [avatarRef, setAvatarRef] = useState(null);
  const [leftJoystick, setLeftJoystick] = useState(null);
  const [rightJoystick, setRightJoystick] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingScreen text="Initializing..." />;
  }

  return (
    <>
      {!isLoaded && <LoadingScreen text="Loading 3D Scene..." />}
      <Scene3D 
        onLoad={() => setIsLoaded(true)} 
        setAvatarRef={setAvatarRef}
        onJoystickMove={(id, movement) => id === 'left' ? setLeftJoystick(movement) : setRightJoystick(movement)}
      />
      {avatarRef && (
        <ThirdPersonControls 
          avatarRef={avatarRef} 
          leftJoystick={leftJoystick}
          rightJoystick={rightJoystick}
        />
      )}
    </>
  );
};

export default IndexPage;
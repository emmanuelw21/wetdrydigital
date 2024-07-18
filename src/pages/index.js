import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import LoadingScreen from '../components/LoadingScreen';

const Scene3D = loadable(() => import('../components/Scene3D'), {
  fallback: <LoadingScreen />,
});

const IndexPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!isClient) {
    return <LoadingScreen text="Initializing..." />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!isLoaded && <LoadingScreen text="Loading 3D Scene..." />}
      <Scene3D onLoad={() => setIsLoaded(true)} />
    </div>
  );
};

export default IndexPage;
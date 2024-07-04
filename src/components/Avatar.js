import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const Avatar = React.forwardRef(({ url }, ref) => {
  const { scene } = useGLTF(url);
  const avatarRef = ref;

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.position.set(0, 0, 0); // Initial position of the avatar
    }
  }, [scene]);

  return scene ? <primitive ref={avatarRef} object={scene} /> : null;
});

export default Avatar;
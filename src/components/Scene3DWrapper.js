import React from 'react';
import Scene3D from './Scene3D';

const Scene3DWrapper = () => {
  if (typeof window !== 'undefined') {
    return <Scene3D />;
  }
  return null;
};

export default Scene3DWrapper;
### 7. `ThirdPersonControls.js`
Handles avatar movement and camera controls.

```javascript
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThirdPersonControls = ({ avatarRef, cameraRef, speed = 0.1, maxHeight = 10 }) => {
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const moveUp = useRef(false);
  const moveDown = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w': moveForward.current = true; break;
        case 's': moveBackward.current = true; break;
        case 'a': moveLeft.current = true; break;
        case 'd': moveRight.current = true; break;
        case 'q': moveUp.current = true; break;
        case 'z': moveDown.current = true; break;
        default: break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w': moveForward.current = false; break;
        case 's': moveBackward.current = false; break;
        case 'a': moveLeft.current = false; break;
        case 'd': moveRight.current = false; break;
        case 'q': moveUp.current = false; break;
        case 'z': moveDown.current = false; break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const animate = () => {
      if (avatarRef.current && cameraRef.current) {
        const avatar = avatarRef.current;
        const camera = cameraRef.current;

        const direction = new THREE.Vector3();

        if (moveForward.current) direction.z -= 1;
        if (moveBackward.current) direction.z += 1;
        if (moveLeft.current) direction.x -= 1;
        if (moveRight.current) direction.x += 1;
        if (moveUp.current) direction.y += 1;
        if (moveDown.current) direction.y -= 1;

        direction.normalize().multiplyScalar(speed);
        direction.applyQuaternion(avatar.quaternion);
        avatar.position.add(direction);

        if (avatar.position.y > maxHeight) avatar.position.y = maxHeight;
        if (avatar.position.y < 0) avatar.position.y = 0;

        const offset = new THREE.Vector3(0, 2, -5);
        offset.applyQuaternion(avatar.quaternion);
        camera.position.copy(avatar.position).add(offset);
        camera.lookAt(avatar.position);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [avatarRef, cameraRef, speed, maxHeight]);

  return null;
};

export default ThirdPersonControls;

import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler } from 'three';

const ThirdPersonControls = ({ avatarRef, speed = 0.1, maxHeight = 10, joystickMove }) => {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          event.preventDefault(); // Prevent default scrolling
          setMoveForward(true);
          break;
        case 's':
        case 'ArrowDown':
          event.preventDefault(); // Prevent default scrolling
          setMoveBackward(true);
          break;
        case 'a':
        case 'ArrowLeft':
          event.preventDefault(); // Prevent default scrolling
          setMoveLeft(true);
          break;
        case 'd':
        case 'ArrowRight':
          event.preventDefault(); // Prevent default scrolling
          setMoveRight(true);
          break;
        case 'q':
          setMoveUp(true);
          break;
        case 'z':
          setMoveDown(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          setMoveForward(false);
          break;
        case 's':
        case 'ArrowDown':
          setMoveBackward(false);
          break;
        case 'a':
        case 'ArrowLeft':
          setMoveLeft(false);
          break;
        case 'd':
        case 'ArrowRight':
          setMoveRight(false);
          break;
        case 'q':
          setMoveUp(false);
          break;
        case 'z':
          setMoveDown(false);
          break;
        default:
          break;
      }
    };

    // Use keydown event listener with 'capture' phase
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!avatarRef.current) return;

    const direction = new Vector3();
    const avatarRotation = avatarRef.current.rotation.y;

    if (moveForward) {
      direction.z -= 1;
    }
    if (moveBackward) {
      direction.z += 1;
    }
    if (moveLeft) {
      direction.x -= 1;
    }
    if (moveRight) {
      direction.x += 1;
    }
    if (moveUp) {
      direction.y += 1;
    }
    if (moveDown && avatarRef.current.position.y > 0) {
      direction.y -= 1;
    }

    // Apply joystick movement
    if (joystickMove) {
      direction.x += joystickMove.deltaX / 50;
      direction.z += joystickMove.deltaY / 50;
    }

    direction.applyAxisAngle(new Vector3(0, 1, 0), avatarRotation);
    direction.normalize().multiplyScalar(speed);
    avatarRef.current.position.add(direction);

    if (avatarRef.current.position.y > maxHeight) {
      avatarRef.current.position.y = maxHeight;
    }
    if (avatarRef.current.position.y < 0) {
      avatarRef.current.position.y = 0;
    }

    const offset = new Vector3(0, 2, -5);
    const rotatedOffset = offset.applyEuler(new Euler(0, avatarRotation, 0));
    camera.position.copy(avatarRef.current.position).add(rotatedOffset);
    camera.lookAt(avatarRef.current.position);
  });

  return null;
};

export default ThirdPersonControls;
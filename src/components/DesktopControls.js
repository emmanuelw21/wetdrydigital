import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

const DesktopControls = ({ controlsRef }) => {
  // UPDATED: Increased speed range for more noticeable changes
  const [speed, setSpeed] = useState(0.3);
  const [verticalSpeed, setVerticalSpeed] = useState(0.14);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!controlsRef.current) return;

      const controls = controlsRef.current;

      switch (event.key) {
        case 'w':
          controls.moveForward(speed);
          break;
        case 's':
          controls.moveForward(-speed);
          break;
        case 'a':
          controls.moveRight(-speed);
          break;
        case 'd':
          controls.moveRight(speed);
          break;
        case 'q':
          controls.getObject().position.y += verticalSpeed;
          break;
        case 'z':
          controls.getObject().position.y -= verticalSpeed;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleClick = () => {
      controlsRef.current.lock();
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [controlsRef, speed, verticalSpeed]);

  // UPDATED: Settings component for desktop speed adjustment
  const Settings = () => (
    <div style={{position: 'absolute', top: '70px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px'}}>
      <h3 style={{color: 'white'}}>Settings</h3>
      <label style={{color: 'white', display: 'block', marginBottom: '10px'}}>
        WASD Speed: {speed.toFixed(2)}
      </label>
      <input 
        type="range" 
        min="0.1" 
        max="1.0" 
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        style={{width: '100%'}}
      />
      <label style={{color: 'white', display: 'block', marginTop: '10px', marginBottom: '10px'}}>
        Q/Z Speed: {verticalSpeed.toFixed(2)}
      </label>
      <input 
        type="range" 
        min="0.05" 
        max="0.5" 
        step="0.05"
        value={verticalSpeed}
        onChange={(e) => setVerticalSpeed(parseFloat(e.target.value))}
        style={{width: '100%'}}
      />
    </div>
  );

  return (
    <>
      <button
        style={{position: 'absolute', right: '10px', top: '10px', width: '50px', height: '50px', fontSize: '24px', background: 'rgba(255,255,255,0.5)', borderRadius: '25px'}}
        onClick={() => setShowSettings(!showSettings)}
      >
        ⚙️
      </button>
      {showSettings && <Settings />}
    </>
  );
};

export default DesktopControls;
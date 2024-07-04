import React from 'react';

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

function ControlsOverlay() {
  return (
    <div style={controlsOverlayStyle}>
      <div style={joystickStyle}>
        <div style={joystickKnobStyle}></div>
      </div>
    </div>
  );
}

export default ControlsOverlay;
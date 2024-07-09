import React from 'react';

const ControlsOverlay = () => {
  return (
    <div style={controlsOverlayStyle}>
      {/* Add any additional overlay controls here */}
    </div>
  );
};

const controlsOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 1000,
};

export default ControlsOverlay;

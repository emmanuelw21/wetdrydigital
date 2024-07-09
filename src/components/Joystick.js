import React, { useState, useEffect, useCallback } from 'react';

const Joystick = ({ id, onMove }) => {
  const [dragging, setDragging] = useState(false);
  const [doubleTapTimer, setDoubleTapTimer] = useState(null);
  const [isDoubleTapped, setIsDoubleTapped] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    setDragging(true);

    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer);
      setIsDoubleTapped(true);
    } else {
      setDoubleTapTimer(setTimeout(() => {
        setDoubleTapTimer(null);
      }, 300));
    }
  }, [doubleTapTimer]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!dragging) return;
    const touch = e.touches[0];
    let deltaX = touch.clientX - startPosition.x;
    let deltaY = touch.clientY - startPosition.y;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50;
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    setCurrentPosition({ x: deltaX, y: deltaY });
    onMove({ deltaX, deltaY, isDoubleTapped });
  }, [dragging, startPosition, isDoubleTapped, onMove]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    setCurrentPosition({ x: 0, y: 0 });
    setIsDoubleTapped(false);
    onMove(null);
  }, [onMove]);

  useEffect(() => {
    const joystick = document.getElementById(`joystick-${id}`);
    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [id, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const containerStyle = {
    position: 'absolute',
    bottom: '20px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...(id === 'left' ? { left: '20px' } : { right: '20px' }),
  };

  const knobStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
  };

  return (
    <div id={`joystick-${id}`} style={containerStyle}>
      <div style={knobStyle} />
    </div>
  );
};

export default Joystick;

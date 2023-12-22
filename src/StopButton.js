import React from 'react';

const StopButton = ({ onStopClick, isAnimating }) => {
  return (
    <button onClick={onStopClick}>
      {isAnimating ? 'Stop Animation' : 'Start Animation'}
    </button>
  );
};

export default StopButton;

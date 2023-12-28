import React from 'react';

export default function AnimationControl({ onAnimate }) {
  return (
    <div>
      {/* Replace these with actual control logic */}
      <button onClick={() => onAnimate('planet1')}>Highlight Planet 1</button>
      <button onClick={() => onAnimate('planet2')}>Highlight Planet 2</button>
      {/* Add more buttons or controls as needed */}
    </div>
  );
}

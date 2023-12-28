import React, { useState } from 'react';

export default function InputTab({ onSubmit, isVisible, onToggle }) {
  const [birthTime, setBirthTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ birthTime, location });
  };

  return (
    <div className={`input-tab ${isVisible ? '' : 'hidden'}`}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Birth Time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <button type="button" className="toggle-button" onClick={onToggle}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

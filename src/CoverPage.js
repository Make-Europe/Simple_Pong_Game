import React from 'react';
import './CoverPage.css';

const CoverPage = ({ onSelectMode }) => {
  return (
    <div className="cover-page">
      <h1>Welcome to Pong Game</h1>
      <p>Select a mode to play:</p>
      <div className="mode-buttons">
        <button onClick={() => onSelectMode('solo')}>Solo</button>
        <button onClick={() => onSelectMode('shared')}>Shared Device</button>
        <button onClick={() => onSelectMode('online (coming soon)')}>Online</button>
      </div>
    </div>
  );
};

export default CoverPage;

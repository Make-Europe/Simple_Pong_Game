import React from 'react';
import './CoverPage.css';

const CoverPage = ({ onSelectMode }) => {
  return (
    <div className="cover-page">
      <h1>Welcome to Pong on $TON</h1>
      <p>Select your playing mode to play:</p>
      <div className="mode-buttons">
        <button onClick={() => onSelectMode('solo')}>Solo</button>
        <button onClick={() => onSelectMode('shared')}>Two Players</button>
        <button onClick={() => onSelectMode('online (coming soon)')}>Online</button>
      </div>
    </div>
  );
};

export default CoverPage;

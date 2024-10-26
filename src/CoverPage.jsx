import React from 'react';
import './CoverPage.css';

const CoverPage = ({ onSelectMode }) => {
  return (
    <div className="cover-page">
      <h1>Welcome to Pong on $TON</h1>
      <p>Select your playing mode:</p>
      <div className="mode-buttons">
        <button className="mode-button" onClick={() => onSelectMode('solo')}>Solo</button>
        <button className="mode-button" onClick={() => onSelectMode('shared')}>Two Players</button>
        <button className="mode-button disabled" disabled>Online (coming soon)</button>
        <button className="mode-button disabled" disabled>Connect Wallet</button>
      </div>
    </div>
  );
};

export default CoverPage;

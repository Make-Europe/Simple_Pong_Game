import React from 'react';
import './CoverPage.css';
import { TonConnectButton } from "@tonconnect/ui-react";


const CoverPage = ({ onSelectMode }) => {
  return (
    <div className="cover-page">
      <header style={{display: 'flex', justifyContent: 'space-between'}}>
          <TonConnectButton />
      </header>
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

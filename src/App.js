import React, { useState } from 'react';
import './App.css';
import PongGame from './PongGame';
import CoverPage from './CoverPage';

function App() {
  const [mode, setMode] = useState(null); // State to hold selected game mode

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleReturnToMenu = () => {
    setMode(null); // Reset mode to null to go back to CoverPage
  };

  return (
    <div className="App">
      <header className="App-header">
        {mode ? (
          <PongGame mode={mode} onReturnToMenu={handleReturnToMenu} /> // Pass handleReturnToMenu to PongGame
        ) : (
          <CoverPage onSelectMode={handleModeSelect} /> // Show CoverPage for mode selection
        )}
      </header>
    </div>
  );
}

export default App;

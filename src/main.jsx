import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <TonConnectUIProvider manifestUrl="https://make-europe.github.io/Simple_Pong_Game/tonconnect-manifest.json">
        <App />
      </TonConnectUIProvider>
  </StrictMode>,
)

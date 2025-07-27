import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import { SimulationProvider } from './context/SimulationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimulationProvider>
      <App />
    </SimulationProvider>
  </React.StrictMode>
);
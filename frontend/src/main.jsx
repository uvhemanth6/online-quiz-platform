// frontend/src/main.jsx                  // Entry point for React app (Vite specific)

import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './App.jsx'; // Imports the main App component
import './index.css'; // Imports your global CSS with Tailwind

// Renders the React application into the 'root' element in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
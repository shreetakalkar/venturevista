import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage'; // Import your HomePage component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomePage />  {/* Render the HomePage component */}
  </React.StrictMode>
);

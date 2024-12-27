import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';  // Import your HomePage component

// Render HomePage component inside the 'root' div
ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById('root') // This will target the <div id="root"></div> in index.html
);

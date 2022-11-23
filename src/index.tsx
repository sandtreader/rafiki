import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './example/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Exports for the library start here too
export { Menu } from './lib/Menu';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import the Router component

import App from './App'; // Import your main application component

ReactDOM.render(
  <Router> {/* Wrap your entire app with Router */}
    <App />
  </Router>,
  document.getElementById('root')
);

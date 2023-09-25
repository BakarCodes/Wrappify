import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const token = window.localStorage.getItem('token');
    setLoggedIn(!!token); // Set loggedIn to true if token is present
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={onLogoClick}>
          Wrappify
        </Link>
        <div className="navbar-buttons">
          {loggedIn && (
            <button
              className={toggleTopTracks ? 'active' : ''}
              onClick={() => toggleTopTracks()}
            >
              Top Tracks
            </button>
          )}
          {loggedIn && (
            <button
              className={toggleTopArtists ? 'active' : ''}
              onClick={() => toggleTopArtists()}
            >
              Top Artists
            </button>
          )}
          <button onClick={onLoginClick} className="login-btn">
            LOG IN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

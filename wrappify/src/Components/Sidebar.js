import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const token = window.localStorage.getItem('token');
    setLoggedIn(!!token); // Set loggedIn to true if token is present
  }, []);

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <Link to="/" className="sidebar-logo" onClick={onLogoClick}>
          Wrappify
        </Link>
        <div className="sidebar-buttons">
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
          </div>
      </div>
    </nav>
  );
}

export default Sidebar;
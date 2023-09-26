import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists, profilePic }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const token = window.localStorage.getItem('token');
    setLoggedIn(!!token); // Set loggedIn to true if token is present
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className='navbar-buttons'>
          <Link to="/" className="navbar-logo" onClick={onLogoClick}>
            Wrappify
          </Link>
          <ul className="navbar-links">
            <li className={`navbar-link ${toggleTopTracks ? 'active' : ''}`}>
              <button onClick={toggleTopTracks}>TOP TRACKS</button>
            </li>
            <li className={`navbar-link ${toggleTopArtists ? 'active' : ''}`}>
              <button onClick={toggleTopArtists}>TOP ARTISTS</button>
            </li>
          </ul>
        </div>
        {!loggedIn && (
          <div className="navbar-buttons">
            <button onClick={onLoginClick} className="login-btn">
              LOG IN
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

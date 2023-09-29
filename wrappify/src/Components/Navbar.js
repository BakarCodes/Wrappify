import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists, profilePic, spotifyProfileURL }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setLoggedIn(!!token);
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
        <div className="profile-tooltip-wrapper">
                <a href={spotifyProfileURL} target="_blank" rel="noopener noreferrer">
                    <img src={profilePic} alt="User Profile" className="user-profile-pic"/>
                </a>
                <span className="profile-tooltip-text">OPEN SPOTIFY</span>
              </div>

      </div>
    </nav>
  );
}

export default Navbar;

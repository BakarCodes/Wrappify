import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists }) {


  const handleLogoClick = () => {
    onLogoClick(); // Call the onLogoClick function from props to handle logo click
  };


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          Wrappify
        </Link>
        <div className="navbar-buttons">
          <button onClick={onLoginClick} className="login-btn">LOG IN</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

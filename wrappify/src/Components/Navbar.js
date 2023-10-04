import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLoginClick, onLogoClick, toggleTopTracks, toggleTopArtists, profilePic, spotifyProfileURL, handleLogout, loggedIn }) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

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
                {loggedIn ? (
                    <div 
                        onMouseEnter={() => setDropdownVisible(true)}
                        onMouseLeave={() => setDropdownVisible(false)}
                        className="profile-dropdown-container"
                    >
                        <img src={profilePic} alt="User Profile" className="user-profile-pic" />
                        {isDropdownVisible && (
                            <div className="profile-dropdown">
                                <a href={spotifyProfileURL} target="_blank" rel="noopener noreferrer">
                                    OPEN SPOTIFY
                                </a>
                                <button onClick={handleLogout} className="logout-dropdown-btn">
                                    LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
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

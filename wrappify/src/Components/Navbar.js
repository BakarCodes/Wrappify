import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';

function Navbar({ onLogin, onLogout, onTopArtists, onTopTracks, onTopGenres }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking the token from localStorage
    const token = window.localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    onLogin(); // Call the onLogin function from props to handle login
  };

  const handleLogoutClick = () => {
    onLogout(); // Call the onLogout function from props to handle logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          Wrappify
        </Link>
        <div className="navbar-buttons">
          {loggedIn ? (
            <>
            <div className="navbar-menu">
                <ul className="nav-menu">
                    <li className="nav-item">
                    <Link className="nav-links" onClick={onTopArtists}>
                        Top Artists
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-links" onClick={onTopTracks}>
                        Top Tracks
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-links" onClick={onTopGenres}>
                        Top Genres
                    </Link>
                    </li>
                </ul>
            </div>
              <Button className="navbar__logout" onClick={handleLogoutClick}>
                Logout
              </Button>
            </>
          ) : (
            <Button className="nav-links" onClick={handleLoginClick}>
              Login to Spotify
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

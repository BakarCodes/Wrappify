import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'



    

function Navbar({ onLogout, onTopArtists, onTopTracks, onTopGenres }) {
    const navigate = useNavigate(); // initialize useNavigate

    const handleLogout = () => {
      onLogout(); // Call the logout function passed from the parent component (Home)
      navigate('/'); // Redirect the user to the landing page after logout
    };

    const handleTopArtists = () => {
        onTopArtists(); // Call the function passed from the parent component (Home) to get top artists
      };
    
      const handleTopTracks = () => {
        onTopTracks(); // Call the function passed from the parent component (Home) to get top tracks
      };
    
      const handleTopGenres = () => {
        onTopGenres(); // Call the function passed from the parent component (Home) to get top genres
      };
  

    const [click, setClick] = useState(false);

    const [button, setButton] = useState(true)

    const handleClick = () => setClick(!click);

    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        }   else {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton();
      }, []);

    window.addEventListener('resize',showButton);

    return (
    <nav className='navbar'>
        
        <div className='navbar-container'>
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                WRAPPIFY
            </Link>
            <div className="navbar-buttons">
                {button && (
                    <>
                    <Link className="navbar__button" onClick={handleTopArtists}>
                        Top Artists
                    </Link>
                    <Link className="navbar__button" onClick={handleTopTracks}>
                        Top Tracks
                    </Link>
                    <Link className="navbar__button" onClick={handleTopGenres}>
                        Top Genres
                    </Link>
                    </>
                )}  
            </div>
            <Button className="navbar-logout" onClick={handleLogout}>
                LOGOUT
            </Button>

        </div>
    </nav>
  )
}
export default Navbar
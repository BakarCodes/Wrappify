import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'
import './Land.css';
import music from '../Images/Music.svg';

function Land({ setToken }) {
    const CLIENT_ID = "da420f0feb8244f4a8c20acd024a6a45";
    const REDIRECT_URI = "http://localhost:3000/home"; // Updated redirect URI
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-top-read playlist-modify-public";

    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;

        if (hash) {
            const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            
            if (token) {
                window.location.hash = "";
                window.localStorage.setItem("token", token);
                setToken(token);
                navigate('/home');
            }
        }
    }, [navigate, setToken]);

    const logout = () => {
        window.localStorage.removeItem("token");
        setToken("");
        navigate('/');
    };

    const loginToSpotify = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
    };

    return (
        <div className="App">
            <Navbar onLogin={loginToSpotify} onLogout={logout} />
            <header className="App-header">
                <section class="one">
                <main className='testimonial-grid'>
                    <article className='testimonial'>
                    <h2 className='AboutMe'>Get wrapped in today</h2>
                    <div className='landGridOne'>
                        <div className='personal'>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <button className="loginButton" onClick={loginToSpotify}>
                                Login to Spotify
                            </button>
                        </div>
                        
                        <div className='musicSVG'>
                            <img src={music} alt="music" />
                        </div>
                    </div>
                    </article>
                    
                </main>
                </section>
                {!window.localStorage.getItem("token") ?
                <section class="one">
                <main className='testimonial-grid'>
                    <article className='testimonial'>
                    <h2 className='AboutMe'>Get wrapped in today</h2>
                    <div className='landGridOne'>
                        <div className='personal'>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <button className="loginButton" onClick={loginToSpotify}>
                                Login to Spotify
                            </button>
                        </div>
                        
                        <div className='musicSVG'>
                            <img src={music} alt="music" />
                        </div>
                    </div>
                    </article>
                    
                </main>
                </section> :
                    <p>hello</p>
                }
            </header>
        </div>
    );    
}

export default Land;


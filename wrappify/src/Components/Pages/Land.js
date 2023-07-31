import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'
import './Land.css';
import music from '../Images/Music.svg';
import visualise from '../Images/Visual.svg';

function Land({ setToken }) {
    const CLIENT_ID = "da420f0feb8244f4a8c20acd024a6a45";
    const REDIRECT_URI = "https://wrappify.uk/home"; // Updated redirect URI
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
            <section class="one">
            <main className='testimonial-grid'>
                <article className='testimonial'>
                <div className='heading'>
                    <h2 className='welcomeMSG'>Get wrapped in today</h2>
                    <h3 className='subHeading'>track your spotify habits</h3>
                </div>

                <div className='landGridOne'>
                    <div className='personal'>
                        <p>Introducing Wrappify, putting the power of Spotify Wrapped in your hands, whenever you want it!</p>
                        <p>Say goodbye to the year-long wait and hello to instant access of your top listens, spanning up to a whole year from today!</p>
                        <p>Discover your destiny in music and dive deep into your musical journey with just a few taps.</p>
                        <button className="loginButton" onClick={loginToSpotify}>
                            Check Yourself
                        </button>
                    </div>
                    
                    <div className='musicSVG'>
                        <img src={music} alt="music" />
                    </div>
                </div>
                </article>
                
            </main>
            </section>
            <section class="two">
            <main className='testimonial-grid'>
                <article className='testimonial'>
                <div className='headingTwo'>
                    <h2 className='topTracksMsg'>Visualise Spotify like never before!</h2>
                </div>
                <div className='landGridOne'>
                    <div className='visualSVG'>
                        <img src={visualise} alt="visual" />
                    </div>
                    <div className='personal'>
                        <h3>Step into the world of music data with Wrappify!</h3>
                        <p>Our app brings you a whole new level of visualization features that allow you to explore your Spotify habits in an innovative way. Gone are the days of waiting for your annual Spotify Wrapped, as Wrappify grants you instant access to your top listens.</p>
                        <p>Discover fascinating insights about your favorite artists, most-played tracks, and trending genres all in one place. Our intelligent algorithms analyze your listening patterns to generate personalized recommendations, giving you the opportunity to explore new music effortlessly.</p>
                    </div>

                </div>
                </article>
                
            </main>
            </section>
                {!window.localStorage.getItem("token") ?
                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
                    <p> We are not related to Spotify AB or any of it´s partners in any way</p>
                </footer> :
                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
                    <p> We are not related to Spotify AB or any of it´s partners in any way</p>
                </footer>

                }

        </div>
    );    
}

export default Land;


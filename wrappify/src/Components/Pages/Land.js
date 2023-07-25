import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'
import './Land.css'

function Land({ setToken }) {
    const CLIENT_ID = "da420f0feb8244f4a8c20acd024a6a45"
    const REDIRECT_URI = "https://wrappify.uk/home" // Updated redirect URI
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-top-read playlist-modify-public"

    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash

        if (hash) {
            const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            
            if (token) {
                window.location.hash = ""
                window.localStorage.setItem("token", token)
                setToken(token)
                navigate('/home');
            }
        }
    }, [navigate, setToken])

    const logout = () => {
        window.localStorage.removeItem("token")
        setToken("")
        navigate('/')
    }

    return (
        <div className="App">

            <header className="App-header">
                <h1 className="landTitle">WRAPPIFY</h1>
                {!window.localStorage.getItem("token") ?

                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
                    : <button onClick={logout}>Logout</button>}
            </header>
        </div>
    );    
}

export default Land;

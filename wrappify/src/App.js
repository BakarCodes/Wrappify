import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
    const CLIENT_ID = "da420f0feb8244f4a8c20acd024a6a45"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-top-read playlist-modify-public"

    const [token, setToken] = useState("")
    const [artists, setArtists] = useState([])
    const [tracks, setTracks] = useState([])
    const [genres, setGenres] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)
    }, [])

    const getUserId = async () => {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.id;
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const getTopArtists = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setTracks([])  // Clear tracks state
        setArtists(data.items)
    }

    const getTopTracks = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setArtists([])  // Clear artists state
        setTracks(data.items)
    }

    const getTopGenres = async () => {
        // fetch top artists
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // clear the state of artists, tracks
        setArtists([])
        setTracks([])

        // create a frequency map of genres
        let genreFreqMap = {};
        data.items.forEach(artist => {
            artist.genres.forEach(genre => {
                if (genre in genreFreqMap) genreFreqMap[genre]++;
                else genreFreqMap[genre] = 1;
            })
        })

        // sort the genres by frequency
        let sortedGenres = Object.keys(genreFreqMap).sort((a, b) => genreFreqMap[b] - genreFreqMap[a]);

        // get the top 4 genres
        let topGenres = sortedGenres.slice(0, 20);

        setGenres(topGenres)
    }

    const createPlaylist = async () => {
        try {
            const userId = await getUserId();
            const playlist = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                "name": "Top Tracks of the Month",
                "description": "Playlist containing my top tracks of the month",
                "public": true
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const playlistId = playlist.data.id;

            await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                "uris": tracks.map(track => track.uri)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error(err);
            alert('An error occurred when trying to create the playlist');
        }
    }

    const renderArtists = () => {
        return (
            <div className="grid-container-artists">
                {artists.map(artist => (
                    <div className="grid-item" key={artist.id}>
                        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                        {artist.name}
                    </div>
                ))}
            </div>
        )
    }

    const renderTracks = () => {
        return (
            <div className="grid-container-tracks">
                {tracks.map(track => (
                    <div className="grid-item" key={track.id}>
                        {track.album.images.length ? <img width={"100%"} src={track.album.images[0].url} alt=""/> : <div>No Image</div>}
                        {track.name} - {track.artists.map(artist => artist.name).join(", ")}
                    </div>
                ))}
            </div>
        )
    }

    const renderGenres = () => {
        return (
            <div className="top-genres">
                {genres.map((genre, index) => (
                    <div key={index}>
                        {genre}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title">WRAPPIFY</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
                    : <button onClick={logout}>Logout</button>}

                {token ? 
                    <>
                        <button onClick={getTopArtists}>Get Top Artists</button>
                        <button onClick={getTopTracks}>Get Top Tracks</button>
                        <button onClick={getTopGenres}>Get Top Genres</button>
                        {tracks.length > 0 && <button onClick={createPlaylist}>Create Playlist</button>}
                    </>
                    : <h2>Please login</h2>
                }

                {renderArtists()}
                {renderTracks()}
                {renderGenres()}

            </header>
        </div>
    );
}

export default App;

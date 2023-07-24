import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'
import { useNavigate } from 'react-router-dom'; // import useNavigate from react-router-dom
import Sidebar from '../sideBar';
import logo from '../Images/Spotify-logo.png';


function Home({setToken}) {
    const navigate = useNavigate(); // initialize useNavigate

    const logout = () => {
        window.localStorage.removeItem("token"); // remove the token from localStorage
        setToken(null); // remove the token from the app's state
        navigate('/'); // redirect the user to the landing page
    }
    

    console.log("Home page rendered");

    useEffect(() => {
        const hash = window.location.hash

        if (hash) {
            const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            
            if (token) {
                window.location.hash = ""
                window.localStorage.setItem("token", token)
                setToken(token)
            }
        }
    }, [setToken]);

    const token = window.localStorage.getItem("token");
    console.log('Token:', token);
    console.log("Home page rendered");
    console.log('Token:', token);
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [playlistUrl, setPlaylistUrl] = useState("")
    const [timeRange, setTimeRange] = useState("short_term")
    
    const getUserId = async () => {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.id;
    }

    const getTopArtists = async () => {
      const {data} = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })

        setTracks([])  // Clear tracks state
        setArtists(data.items)
    }


    const getTopTracks = async () => {
      const {data} = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })

        setArtists([])  // Clear artists state
        setTracks(data.items)
    }

    const getTopGenres = async () => {
      const {data} = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`, {
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
  
          setPlaylistUrl(playlist.data.external_urls.spotify); // Save the playlist's Spotify URL to the state
          alert('Your playlist has been created! You can now view it on Spotify.');
  
      } catch (err) {
          console.error(err);
          alert('An error occurred when trying to create the playlist');
      }
  }
  
  const renderTracks = () => {
    return (
        <ul className="track-list">
            {tracks.map(track => (
                <li className="track-list-item" key={track.id}>
                    {track.album.images.length ? <img className='albumImg' src={track.album.images[0].url} alt=""/> : <div>No Image</div>}
                    <div>{track.name} - {track.artists.map(artist => artist.name).join(", ")}</div>
                    <div>
                        <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noreferrer" className="spotify-button">
                            <img src={logo} alt="Spotify Logo" className="spotify-logo"/>
                            <span>Play Track</span>
                        </a>
                    </div>
                </li>
            ))}
        </ul>
    )
}

const renderArtists = () => {
    return (
        <ul className="artist-list">
            {artists.map(artist => (
                <li className="artist-list-item" key={artist.id}>
                    {artist.images.length ? <img className="artistImg" src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                    <div>{artist.name}</div>
                    <div>
                        <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noreferrer" className="spotify-button">
                            <img src={logo} alt="Spotify Logo" className="spotify-logo"/>
                            <span>View Artist</span>
                        </a>
                    </div>
                </li>
            ))}
        </ul>
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
        <div>
            <div className='homePage'>
                <h1 className="title">WRAPPIFY</h1>

                {token ? 
                    <>
                        <select onChange={(e) => setTimeRange(e.target.value)}>
                            <option value="short_term">Monthly</option>
                            <option value="medium_term">6 Months</option>
                            <option value="long_term">Yearly</option>
                        </select>
                        <button onClick={getTopArtists}>Get Top Artists</button>
                        <button onClick={getTopTracks}>Get Top Tracks</button>
                        <button onClick={getTopGenres}>Get Top Genres</button>
                        {tracks.length > 0 && <button onClick={createPlaylist}>Create Playlist</button>}
                        {playlistUrl && <a href={playlistUrl} target="_blank" rel="noreferrer">View the new playlist on Spotify</a>}
                        <button onClick={logout}>Logout</button> {/* logout button */}
                    </>
                    : <h2>Please login</h2>
                }

                {renderArtists()}
                {renderTracks()}
                {renderGenres()}
            </div>
        </div>
    );
}

export default Home;
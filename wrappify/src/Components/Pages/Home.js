import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/Spotify-logo.png';

function Home({ setToken }) {
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  console.log('Home page rendered');

  const token = window.localStorage.getItem('token');
  console.log('Token:', token);
  console.log('Home page rendered');
  console.log('Token:', token);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [timeRange, setTimeRange] = useState('short_term');
  const [selectedTable, setSelectedTable] = useState('tracks');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking the token from localStorage
    const token = window.localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);


  const getUserId = async () => {
    const { data } = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.id;
  };

  const getTopArtists = useCallback(async () => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTracks([]); // Clear tracks state
      setArtists(data.items);
    } catch (error) {
      console.error(error);
      // Handle the 401 error here, e.g., redirect to the login page or refresh the access token.
    }
  }, [token, timeRange]);


  const getTopTracks = useCallback(async () => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      });

      setArtists([]); // Clear artists state
      setTracks(data.items);
    } catch (error) {
      console.error(error);
      // Handle the 401 error here, e.g., redirect to the login page or refresh the access token.
    }
  }, [token, timeRange]);
  
  
  const getTopGenres = useCallback(async () => {
    const { data } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // clear the state of artists, tracks
    setArtists([]);
    setTracks([]);

    // create a frequency map of genres
    let genreFreqMap = {};
    data.items.forEach(artist => {
      artist.genres.forEach(genre => {
        if (genre in genreFreqMap) genreFreqMap[genre]++;
        else genreFreqMap[genre] = 1;
      });
    });

    // sort the genres by frequency
    let sortedGenres = Object.keys(genreFreqMap).sort((a, b) => genreFreqMap[b] - genreFreqMap[a]);

    // get the top 4 genres
    let topGenres = sortedGenres.slice(0, 20);

    setGenres(topGenres);
  }, [token, timeRange]);

  
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

      if (token) {
        window.location.hash = '';
        window.localStorage.setItem('token', token);
        setToken(token);
      }
    }
    getTopTracks();
  }, [setToken, getTopTracks]);


  useEffect(() => {
    // Fetch the data based on the selected time range when the component mounts and when the time range changes
    if (selectedTable === 'artists') {
      getTopArtists();
    } else if (selectedTable === 'tracks') {
      getTopTracks();
    } else if (selectedTable === 'genres') {
      getTopGenres();
    }
  }, [timeRange, selectedTable, getTopArtists, getTopTracks, getTopGenres]);


  const handleTopArtists = async () => {
    setSelectedTable('artists');
    await getTopArtists();
  };

  const handleTopTracks = async () => {
    setSelectedTable('tracks');
    await getTopTracks();
  };

  const handleTopGenres = async () => {
    setSelectedTable('genres');
    await getTopGenres();
  };

  const handleDurationChange = (e) => {
    setTimeRange(e.target.value);
  };


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



  const renderArtists = () => {
    return (
      <div className="center-container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="columnTitle">
                <th>Ranking</th>
                <th>Artist Name</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist, index) => (
                <tr key={artist.id}>
                  <td className="ranking">{`${index + 1}`}</td>
                  <td className="description">{artist.name}</td>
                  <td className="image-container">
                    {artist.images.length ? (
                      <img className="artistImg" src={artist.images[0].url} alt="" />
                    ) : (
                      <div>No Image</div>
                    )}
                    <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noreferrer" className="spotify-button">
                      <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                      View Artist
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTracks = () => {
    return (
      <div className="center-container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="columnTitle">
                <th>Ranking</th>
                <th>Artist Name with Track Name</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr key={track.id}>
                  <td className="ranking">{`${index + 1}`}</td>
                  <td className="description">
                    <div className="trackName">{track.name}</div>
                    <div className="artistName">
                      {track.artists.map((artist) => artist.name).join(' ft. ')}
                    </div>
                  </td>
                  <td className="image-container">
                    {track.album.images.length ? (
                      <img className="albumImg" src={track.album.images[0].url} alt="" />
                    ) : (
                      <div>No Image</div>
                    )}
                    <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noreferrer" className="spotify-button">
                      <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                      OPEN TRACK
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGenres = () => {
    return (
      <div className="center-container">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="columnTitle">
                <th>Ranking</th>
                <th>Genre</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre, index) => (
                <tr key={index}>
                  <td className="ranking">{`${index + 1}`}</td>
                  <td className="description">{genre}</td>
                  {/* Add percentage data if you have it available */}
                  <td className="percentage">{/* Add percentage data here */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar
        onTopArtists={handleTopArtists}
        onTopTracks={handleTopTracks}
        onTopGenres={handleTopGenres}
        onLogout={logout}
        isLoggedIn={isLoggedIn} // Pass the isLoggedIn state to the Navbar
      />
      <section className="three">
        <div className="image-grid">
          {token ? (
            <>
              <select className="duration" onChange={handleDurationChange} value={timeRange}>
                <option value="short_term">Monthly</option>
                <option value="medium_term">6 Months</option>
                <option value="long_term">Yearly</option>
              </select>
              {tracks.length > 0 && <button className="playlist" onClick={createPlaylist}>Create Playlist</button>}
              {playlistUrl && <a className="playlistLink" href={playlistUrl} target="_blank" rel="noreferrer">View the new playlist on Spotify</a>}

              <div className="table">
                <div className="selections"></div>
                {selectedTable === 'artists' && renderArtists()}
                {selectedTable === 'tracks' && renderTracks()}
                {selectedTable === 'genres' && renderGenres()}
              </div>
            </>
          ) : (
            <h2>Please login</h2>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/Spotify-logo.png';
import music from '../Images/Music.svg';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Card } from '@mui/material';

function Home({ setToken }) {
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  console.log('Home page rendered');

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
  }, [setToken]);

  const token = window.localStorage.getItem('token');
  console.log('Token:', token);
  console.log('Home page rendered');
  console.log('Token:', token);

  const [showWelcome, setShowWelcome] = useState(true);
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

  const getTopArtists = async () => {
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
  };


  const getTopTracks = async () => {
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
  };

  const getTopGenres = async () => {
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
  };

  useEffect(() => {
    // Fetch the data based on the selected time range when the component mounts and when the time range changes
    if (selectedTable === 'artists') {
      getTopArtists();
    } else if (selectedTable === 'tracks') {
      getTopTracks();
    } else if (selectedTable === 'genres') {
      getTopGenres();
    }
  }, [timeRange, selectedTable]);

  const handleTopArtists = async () => {
    setSelectedTable('artists');
    setShowWelcome(false);
    await getTopArtists();
  };

  const handleTopTracks = async () => {
    setSelectedTable('tracks');
    setShowWelcome(false);
    await getTopTracks();
  };

  const handleTopGenres = async () => {
    setSelectedTable('genres');
    setShowWelcome(false);
    await getTopGenres();
  };

  const handleDurationChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleLogoClick = () => {
    setShowWelcome(true); // Set the state to show the welcome content when the logo is clicked
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
        const playlistUrl = playlist.data.external_urls.spotify;
        setPlaylistUrl(playlistUrl); // Save the playlist's Spotify URL to the state
        window.open(playlistUrl, "_blank");

    } catch (err) {
        console.error(err);
    }
}


const renderArtists = () => {
  return (
    <div className="center-container">
      <div className="selections">
        <Select className="duration" onChange={handleDurationChange} value={timeRange}>
          <MenuItem value="short_term">Monthly</MenuItem>
          <MenuItem value="medium_term">6 Months</MenuItem>
          <MenuItem value="long_term">Yearly</MenuItem>
        </Select>
      </div>
      <TableContainer component={Paper} className="spotify-table-container">
        <Table className="spotify-table">
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell">Ranking</TableCell>
              <TableCell className="spotify-table-cell">Artist Name</TableCell>
              <TableCell className="spotify-table-cell">Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map((artist, index) => (
              <TableRow key={artist.id}>
                <TableCell className="spotify-table-cell">{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell">{artist.name}</TableCell>
                <TableCell className="spotify-table-cell">
                  {artist.images.length ? (
                    <img className="artistImg" src={artist.images[0].url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                  <a
                    href={`https://open.spotify.com/artist/${artist.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="spotify-button"
                    style={{ backgroundColor: 'var(--spotify-green)', color: 'var(--spotify-white)' }}
                  >
                    <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                    View Artist
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
const renderTracks = () => {
  return (
    <div className="center-container">
      <div className="selections">
        <Select className="duration" onChange={handleDurationChange} value={timeRange}>
          <MenuItem value="short_term">Monthly</MenuItem>
          <MenuItem value="medium_term">6 Months</MenuItem>
          <MenuItem value="long_term">Yearly</MenuItem>
        </Select>
        {tracks.length > 0 && (
          <Button className="playlist" variant="contained" onClick={createPlaylist}>
            Create Playlist
          </Button>
        )}
        {playlistUrl && (
          <a className="spotify-link" href={playlistUrl} target="_blank" rel="noreferrer">
          </a>
        )}
      </div>
      <TableContainer component={Card} className="spotify-table-container">
        <Table className="spotify-table">
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell">Ranking</TableCell>
              <TableCell className="spotify-table-cell">Artist Name with Track Name</TableCell>
              <TableCell className="spotify-table-cell">Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track, index) => (
              <TableRow key={track.id}>
                <TableCell className="spotify-table-cell">{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell">
                  <div className="trackName">{track.name}</div>
                  <div className="artistName">
                    {track.artists.map((artist) => artist.name).join(' ft. ')}
                  </div>
                </TableCell>
                <TableCell className="spotify-table-cell image-container">
                  {track.album.images.length ? (
                    <img className="albumImg" src={track.album.images[0].url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="spotify-button"
                    style={{ backgroundColor: 'var(--spotify-green)', color: 'var(--spotify-white)' }}
                  >
                    <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                    OPEN TRACK
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const renderGenres = () => {
  return (
    <div className="center-container">
      <div className="selections">
        <Select className="duration" onChange={handleDurationChange} value={timeRange}>
          <MenuItem value="short_term">Monthly</MenuItem>
          <MenuItem value="medium_term">6 Months</MenuItem>
          <MenuItem value="long_term">Yearly</MenuItem>
        </Select>
      </div>
      <TableContainer component={Paper} className="spotify-table-container">
        <Table className="spotify-table">
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell">Ranking</TableCell>
              <TableCell className="spotify-table-cell">Genre</TableCell>
              <TableCell className="spotify-table-cell">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre, index) => (
              <TableRow key={index}>
                <TableCell className="spotify-table-cell">{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell">{genre}</TableCell>
                {/* Add percentage data if you have it available */}
                <TableCell className="spotify-table-cell">{/* Add percentage data here */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};


return (
  <div>
    <Navbar 
      onLogoClick={handleLogoClick}
      onTopArtists={handleTopArtists}
      onTopTracks={handleTopTracks}
      onTopGenres={handleTopGenres}
      onLogout={logout}
      isLoggedIn={isLoggedIn}
     />
    <div className="center-page">
    <section className="three">
      <div className="image-grid">
        {token ? (
          <>
            {showWelcome ? (
                <>
                <section class="one">
                  <main className='testimonial-grid'>
                    <article className='testimonial'>
                    <h2 className='AboutMe'>Who was your guilty pleasure?</h2>
                    <div className='landGridOne'>
                        <div className='personal'>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <div className="home-buttons">
                              <button className='loginButton' onClick={handleTopTracks}>Wrap Up</button>
                            </div>
                        </div>
                  
                        <div className='musicSVG'>
                            <img src={music} alt="music" />
                        </div>
                    </div>
                    </article>
                    
                  </main>
                </section>

                </>
            ) : (
              <>
                <div className="renderedPage">
                  {selectedTable === 'artists' && renderArtists()}
                  {selectedTable === 'tracks' && renderTracks()}
                  {selectedTable === 'genres' && renderGenres()}
                </div>
              </>
            )}
          </>
        ) : (
          <h2>Please login</h2>
        )}
      </div>
    </section>
  </div>
  </div>
);

}

export default Home;




import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/Spotify-logo.png';
import music from '../Images/Music.svg';
import love from '../Images/Love.svg';
import { fetchAccessToken } from './spotifyAuthUtils';
import Footer from './Land'

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
              getUserProfile();
      }
    }
  }, [setToken]);


  useEffect (() => {
    // In a useEffect or equivalent:
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      fetchAccessToken(code);
      // Then fetch user data as needed using the access token
    }
  })

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
  const [genreFreqMap, setGenreFreqMap] = useState({});


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

const fetchUserProfile = async (token) => {
  try {
      const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });
      const data = await response.json();
      if (data.error) {
          throw new Error(data.error.message);
      }
      return data;
  } catch (error) {
      console.error("Error fetching user profile:", error);
  }
};  

useEffect(() => {
  const token = window.localStorage.getItem("token");
  if (token) {
      const getUserData = async () => {
          const userProfile = await fetchUserProfile(token);
          if (userProfile) {
              const userId = userProfile.id;
              const userEmail = userProfile.email;
              console.log("User ID:", userId);
              console.log("User Email:", userEmail);
              // Store them in state or do whatever you need with these values
          }
      };
      getUserData();
  }
}, []);  // <-- Empty dependency array ensures this useEffect runs once after component mounts


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

    setGenreFreqMap(genreFreqMap); // Set the genre frequency map in the state
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


const tableStyles = {
  backgroundColor: 'black',
  color: 'white', // Change the text color to white
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const tableCellStyles = {
  padding: '10px',
  borderBottom: '2px solid #1DB954',
  color: 'white', // Change the text color to white
};

const imageStyles = {
  width: '100%',
  maxWidth: '150px',
  border: '2px solid white', // Change the border color to white
};

const spotifyButtonStyles = {
  textAlign: 'center',
  fontSize: '1rem',
  display: 'flex',
  width: '100%',
  maxWidth: '150px',
  alignItems: 'center',
  color: 'black', // Change the text color to black
  backgroundColor: '#1DB954',
  border: '2px solid white', // Change the border color to white
  textDecoration: 'none',
  transition: 'background-color 0.2s ease',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 'bold',
};

const spotifyButtonHoverStyles = {
  backgroundColor: '#1ED760',
};

async function getUserProfile() {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.display_name) {
      console.log(`User is logged in as: ${response.data.display_name}`);
    } else {
      console.log('User is logged in, but display name is not available.');
    }

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('User is not logged in.');
    } else {
      console.error('An error occurred:', error);
    }
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
        <Table className="spotify-table" style={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Ranking</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Artist Name</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map((artist, index) => (
              <TableRow key={artist.id}>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>{artist.name}</TableCell>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>
                  {artist.images.length ? (
                    <img className="artistImg" src={artist.images[0].url} alt="" style={imageStyles} />
                  ) : (
                    <div>No Image</div>
                  )}
                  <a
                    href={`https://open.spotify.com/artist/${artist.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="spotify-button"
                    style={spotifyButtonStyles}
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
          <button className="playlist" variant="contained" onClick={createPlaylist}>
            Create Playlist
          </button>
        )}
        {playlistUrl && (
          <a className="spotify-link" href={playlistUrl} target="_blank" rel="noreferrer">
          </a>
        )}
      </div>
      <TableContainer component={Card} className="spotify-table-container">
        <Table className="spotify-table" style={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Ranking</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Artist Name with Track Name</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track, index) => (
              <TableRow key={track.id}>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>
                  <div className="trackName">{track.name}</div>
                  <div className="artistName">
                    {track.artists.map((artist) => artist.name).join(' ft. ')}
                  </div>
                </TableCell>
                <TableCell className="spotify-table-cell image-container">
                  {track.album.images.length ? (
                    <img className="albumImg" src={track.album.images[0].url} alt="" style={imageStyles} />
                  ) : (
                    <div>No Image</div>
                  )}
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="spotify-button"
                    style={spotifyButtonStyles}
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
        <Table className="spotify-table" style={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Ranking</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Genre</TableCell>
              <TableCell className="spotify-table-cell" style={tableCellStyles}>Time Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres.map((genre, index) => (
              <TableRow key={genre}>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>{`${index + 1}`}</TableCell>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>{genre}</TableCell>
                <TableCell className="spotify-table-cell" style={tableCellStyles}>
                  <div className="genreBarContainer">
                    <div
                      className="genreBar"
                      style={{ width: `${(genreFreqMap[genre] / 30) * 100}%` }}
                    ></div>
                    <span>{genreFreqMap[genre]}</span>
                  </div>
                </TableCell>
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
                <section className="one">
                  <main className='testimonial-grid'>
                    <article className='testimonial'>
                    <h2 className='AboutMe'>Who was your guilty pleasure?</h2>
                    <div className='landGridOne'>
                        <div className='personal'>
                            <p>Everyone has a guilty pleasure, that one artist, track, or genre they secretly enjoy and can't resist tapping their feet to. It's the guilty pleasure that brings out the inner music lover, the one you indulge in when no one's watching.</p>
                            <div className="home-buttons">
                              <button className='loginButton' onClick={handleTopTracks}>Get Wrapped Up</button>
                            </div>
                        </div>
                  
                        <div className='loveSVG'>
                            <img src={love} alt="love" />
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
                <footer className="footer">
                    <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
                    <p> We are not related to Spotify AB or any of it´s partners in any way</p>
                </footer> 
            </>
   
        ) : (
          <footer className="footer">
              <p>&copy; {new Date().getFullYear()} Wrappify. All rights reserved.</p>
              <p> We are not related to Spotify AB or any of it´s partners in any way</p>
          </footer>

        )}
      </div>
    </section>
  </div>
  </div>
);

}

export default Home;




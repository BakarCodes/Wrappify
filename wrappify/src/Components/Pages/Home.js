import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom'; // import useNavigate from react-router-dom
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
    return tracks.map((track, index) => (
      <section ref={[index]} className={`section${index + 1}`} key={track.id}>
        <div className='outline'>
          <div className='info'>

            <div className='ranking'>{`${index + 1}`}</div>
            <div className='firstRow'>
                <div className='description'>
                    <div className='trackName'>{track.name}</div>
                    <div className='artistName'>{track.artists.map(artist => artist.name).join(" ft. ")}</div>
                </div>
            </div>
          </div>
          <div className='image-container'>
            <div className='image'>
                {track.album.images.length ? <img className='albumImg' src={track.album.images[0].url} alt="" /> : <div>No Image</div>}
                <div className='spotify-link'>
                    <a href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noreferrer" className='spotify-button'>
                                <img src={logo} alt="Spotify Logo" className="spotify-logo" />
                                OPEN TRACK
                    </a>
                </div>    
            </div>
          </div>
        </div>
      </section>
    ));
  };
  
  
  
  

const renderArtists = () => {
    return artists.map((artist, index) => (
        <section ref={[index]} className={`section${index + 1}`}>
            <div className='outlineArtist'>
            <div className='info'>
              <div className='ranking'>
                {`${index + 1}`}
              </div>
              <div className='firstRow'>
                <div className='description'>
                    <div className='artistOnly'>
                        {artist.name}
                    </div>
                </div>
              </div>
              </div>
              <div className='image-container'>
                <div className='artistImage'>
                    {artist.images.length ? <img className='artistImg' src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                    <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noreferrer" className='spotify-button'>
                        <img src={logo} alt="Spotify Logo" className="spotify-logo" /> View Artist
                    </a>
                </div>
              </div>

            </div>

        </section>
    ))
}

const renderGenres = () => {
    return genres.map((genre, index) => (
        <div className='projectOne' key={index}>
            <div className='projectTitle'>Genre</div>
            <div className='projectDesc'>{genre}</div>
            <div className='image'>
                <img className='genreImg' src={logo} alt=""/> {/* You can replace `logo` with a suitable image */}
            </div>
        </div>
    ))
}

const handleTopArtists = async () => {
    await getTopArtists();
  };

  const handleTopTracks = async () => {
    await getTopTracks();
  };

  const handleTopGenres = async () => {
    await getTopGenres();
  };

return (
    <div>
    <Navbar 
        onTopArtists={handleTopArtists}
        onTopTracks={handleTopTracks}
        onTopGenres={handleTopGenres}
        onLogout={logout} 
        />
      <section class="three">
        <div className='image-grid'>
          {token ? (
            <>

              
              <div className="table">

                <div className="selections">
                    <div className='menu'>
                        <div>

                        </div>
                        <select className='duration' onChange={(e) => setTimeRange(e.target.value)}>
                            <option value="short_term">Monthly</option>
                            <option value="medium_term">6 Months</option>
                            <option value="long_term">Yearly</option>
                        </select>
                        <div className='playlistBox'>
                            {tracks.length > 0 && <button className='playlist' onClick={createPlaylist}>Create Playlist</button>}
                                {playlistUrl && <a href={playlistUrl} target="_blank" rel="noreferrer">View the new playlist on Spotify</a>}
                        </div>
                    </div>

                </div>

                {/* Rendered items go here */}
                {renderArtists()}
                {renderTracks()}
                {renderGenres()}

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
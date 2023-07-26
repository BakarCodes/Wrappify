import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Images/Spotify-logo.png';

function TopTracks({ token }) {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');

  const getTopTracks = async () => {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTracks(data.items);
  };

  const renderTracks = () => {
    return tracks.map((track, index) => (
      <section ref={[index]} className={`section${index + 1}`} key={track.id}>
        <div className='outline'>
          <div className='info'>
            <div className='ranking'>{`${index + 1}`}</div>
            <div className='firstRow'>
              <div className='description'>
                <div className='trackName'>{track.name}</div>
                <div className='artistName'>
                  {track.artists.map((artist) => artist.name).join(' ft. ')}
                </div>
              </div>
            </div>
          </div>
          <div className='image-container'>
            <div className='image'>
              {track.album.images.length ? (
                <img className='albumImg' src={track.album.images[0].url} alt='' />
              ) : (
                <div>No Image</div>
              )}
              <div className='spotify-link'>
                <a
                  href={`https://open.spotify.com/track/${track.id}`}
                  target='_blank'
                  rel='noreferrer'
                  className='spotify-button'
                >
                  <img src={logo} alt='Spotify Logo' className='spotify-logo' />
                  OPEN TRACK
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    ));
  };

  const handleTopTracks = async () => {
    await getTopTracks();
  };

  useEffect(() => {
    getTopTracks();
  }, [timeRange, token]);

  return (
    <div>
      <div className='menu'>
        <div></div>
        <select className='duration' onChange={(e) => setTimeRange(e.target.value)}>
          <option value='short_term'>Monthly</option>
          <option value='medium_term'>6 Months</option>
          <option value='long_term'>Yearly</option>
        </select>
      </div>

      {/* Rendered tracks go here */}
      <div className='trackTable'>{renderTracks()}</div>
    </div>
  );
}

export default TopTracks;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Images/Spotify-logo.png';

function TopArtists({ token }) {
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');

  const getTopArtists = async () => {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setArtists(data.items);
  };

  const renderArtists = () => {
    return artists.map((artist, index) => (
      <section ref={[index]} className={`section${index + 1}`} key={artist.id}>
        <div className='outlineArtist'>
          <div className='info'>
            <div className='ranking'>{`${index + 1}`}</div>
            <div className='firstRow'>
              <div className='description'>
                <div className='artistOnly'>{artist.name}</div>
              </div>
            </div>
          </div>
          <div className='image-container'>
            <div className='artistImage'>
              {artist.images.length ? (
                <img className='artistImg' src={artist.images[0].url} alt='' />
              ) : (
                <div>No Image</div>
              )}
              <a
                href={`https://open.spotify.com/artist/${artist.id}`}
                target='_blank'
                rel='noreferrer'
                className='spotify-button'
              >
                <img src={logo} alt='Spotify Logo' className='spotify-logo' /> View Artist
              </a>
            </div>
          </div>
        </div>
      </section>
    ));
  };

  const handleTopArtists = async () => {
    await getTopArtists();
  };

  useEffect(() => {
    getTopArtists();
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

      {/* Rendered artists go here */}
      <div className='artistTable'>{renderArtists()}</div>
    </div>
  );
}

export default TopArtists;

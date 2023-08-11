

export const redirectToSpotifyLogin = () => {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const SCOPES = 'user-read-private user-read-email';  // Add scopes as needed
    window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
  };
  
  export const fetchAccessToken = async (code) => {
    const response = await fetch("/server/token", {  // This should point to your server-side endpoint that exchanges the code for a token
      method: "POST",
      body: JSON.stringify({ code }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_token_expiry", Date.now() + data.expires_in * 1000);
  };
  

  export const refreshToken = async () => {
    // You need to have the refresh token stored somewhere, possibly in localStorage
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (!storedRefreshToken) {
      console.error('No refresh token found');
      return;
    }
  
    try {
      const response = await fetch('/refresh_token', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: storedRefreshToken
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('spotify_access_token', data.access_token);
        // Also update the token expiry time in localStorage or wherever you keep it
        // Example: localStorage.setItem('spotify_token_expiry', Date.now() + data.expires_in * 1000);
      } else {
        console.error('Refresh failed', data);
      }
  
    } catch (error) {
      console.error('Error refreshing token', error);
    }
  };
  

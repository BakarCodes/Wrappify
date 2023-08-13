import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Land from './Components/Pages/Land';
import Home from './Components/Pages/Home';
import db from './Components/firebase';

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token') || '');

  // Define isLoggedIn state to pass to Home and Navbar components
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  
  useEffect(() => {
    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => response.json())
      .then(data => {
        // Check if the user already exists in Firestore
        const userRef = db.collection('users').doc(data.email);
        userRef.get().then(doc => {
          if (!doc.exists) {
            userRef.set({
              full_name: data.id,
              email: data.email
            });
          }
        });
      })
      .catch(error => {
        console.error('Error handling user:', error);
      });
    }
  }, [token]); // Effect depends on the token, so it will run whenever the token changes

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Land token={token} setToken={setToken} isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/home"
          element={<Home token={token} setToken={setToken} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

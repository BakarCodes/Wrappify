import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Land from './Components/Pages/Land';
import Home from './Components/Pages/Home';
import db from './Components/firebase';

function App() {
  const [token, setToken] = useState(window.localStorage.getItem('token') || '');

  // Define isLoggedIn state to pass to Home and Navbar components
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  

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

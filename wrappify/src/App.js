import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Land from './Components/Pages/Land';
import Home from './Components/Pages/Home';

function App() {
    const [token, setToken] = useState(window.localStorage.getItem("token") || "");

    return (
        <Router>
              <Routes>
                  <Route path="/" element={<Land token={token} setToken={setToken} />} />
                  <Route path="/home" element={<Home token={token} setToken={setToken} />} />
              </Routes>
        </Router>
    );
}

export default App;



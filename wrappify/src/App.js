import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Pages/Home';
import Wrapped from './Components/Pages/Wrapped';

function App() {
  return (
    <Routes> {/* Use Routes component */}
      <Route path="/" element={<Home />} />
      <Route path="/wrapped" element={<Wrapped />} />
    </Routes>
  );
}

export default App;


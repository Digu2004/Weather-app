import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navabar from './component/Navabar';
import Card from './Card';

function App() {
  const [city, setCity] = useState(''); // city from Navbar

  return (
    <div>
      <Navabar onInputChange={setCity} />
      <Card city={city} />
    </div>
  );
}

export default App;

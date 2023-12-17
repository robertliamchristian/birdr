import React, { useState, useEffect } from 'react';
import Login from './Login';
import BirdList from './BirdList';
import AddBird from './AddBird';
import './App.css';
import BirdSuggestions from './BirdSuggestions';

function App() {
  const [user, setUser] = useState(null);
  const [birds, setBirds] = useState([]);
  const [birdName, setBirdName] = useState('');
  const [colors, setColors] = useState([]); // Add state for colors

  const fetchBirds = () => {
    fetch('http://localhost:5002/api/birds', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setBirds(data);
      });
  };

  useEffect(() => {
    if (user) {
      fetchBirds();
    }
  }, [user]);

  const handleAddBird = async (birdName) => {
    const response = await fetch('http://localhost:5002/api/sightings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birdname: birdName }),
      credentials: 'include',
    });

    if (response.ok) {
      const newSighting = await response.json();
      console.log('New sighting added:', newSighting);
      fetchBirds();
    } else {
      console.error('Failed to add sighting');
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.username);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleColorSelect = (selectedColors) => { // Add handler for color selection
    setColors(selectedColors);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header>
        <div className="logo">
          <h1>Birdedex</h1>
        </div>
        <div className='loggedin'><p>Logged in as: {user}</p></div>
      </header>
      <main>
        <div className="bird-entry">
          <AddBird onAddBird={handleAddBird} onBirdNameChange={setBirdName} onColorSelect={handleColorSelect} /> {/* Pass handleColorSelect as a prop */}
          <BirdSuggestions query={birdName} colors={colors} /> {/* Pass colors to BirdSuggestions */}
        </div>
        <div className="bird-list">
          <BirdList birds={birds} />
        </div>
      </main>
    </div>
  );
}

export default App;
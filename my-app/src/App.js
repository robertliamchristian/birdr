import React, { useState, useEffect } from 'react';
import Login from './Login';
import BirdList from './BirdList';
import AddBird from './AddBird';
import './App.css';
import BirdSuggestions from './BirdSuggestions';
import DropdownMenu from './DropdownMenu';

function App() {
  const [birds, setBirds] = useState([]);
  const [user, setUser] = useState(null);
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [birdName, setBirdName] = useState('');

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

  const handleColorSelect = (selectedColors) => {
    setColors(selectedColors);
  };

  const handleRegionSelect = (selectedRegions) => { // Add handler for region selection 
    setRegions(selectedRegions);
  };
  
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header>
        {/* ...header content... */}
      </header>
      <main>
        <div className="main-content">
          <div className="card">
            <div className="top-card">
              <div className="enter-bird">
                {/* Your bird entry form components here */}
                <AddBird onAddBird={handleAddBird} onColorSelect={handleColorSelect} onRegionSelect={handleRegionSelect} />
              </div>
              <div className="bs">
                {/* Your bird suggestions components here */}
                <BirdSuggestions query={birdName} colors={colors} regions={regions} />
              </div>
              <div className='dropdown'><DropdownMenu /></div>
            </div>
            <div className="bottom-card">
              <div className="bird-list">
                {/* Your bird list component here */}
                <BirdList birds={birds} />
              </div>
            </div>
          </div>
          <div className='bottom-container'>
          <div className="logo">
            <h3>Birdedex</h3>
          </div>
          <div className='loggedin'>
            <p>Logged in as: {user}</p>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default App;
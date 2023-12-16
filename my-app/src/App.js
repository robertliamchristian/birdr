import React, { useState, useEffect } from 'react';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);  // State to store the logged-in user
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    // Fetch the list of birds only when the user is logged in
    if (user) {
      fetch('http://localhost:5002/api/birds')
        .then(response => response.json())
        .then(data => setBirds(data));
    }
  }, [user]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
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

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header>
        <h1>Birdedex</h1>
        <p>Logged in as: {user}</p>
      </header>
      <main>
        <ul>
          {birds.map(bird => (
            <li key={bird.birdid}>
              {bird.birdid}: {bird.bird}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;

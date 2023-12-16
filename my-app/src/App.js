import React, { useState, useEffect } from 'react';
import Login from './Login';
import BirdList from './BirdList';  // Import BirdList


function App() {
  const [user, setUser] = useState(null);  // State to store the logged-in user
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5002/api/birds', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Log the data here
        setBirds(data);
      });
    }
  }, [user]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  // Include this line
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
        <BirdList birds={birds} />  // Use BirdList to display the birds
      </main>
    </div>
  );
}

export default App;

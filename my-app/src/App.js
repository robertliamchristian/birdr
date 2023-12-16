import React, { useState, useEffect } from 'react';


function App() {
  const [birds, setBirds] = useState([]);  // State to store the list of birds

  useEffect(() => {
    // Fetch the list of birds from the Flask API
    const fetchBirds = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/birds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBirds(data);  // Update the state with the fetched birds
      } catch (error) {
        console.error('Error fetching birds:', error);
      }
    };

    fetchBirds();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Birdedex</h1>
      </header>
      <main>
        <ul>
          {birds.map((bird) => (
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

import React, { useState, useEffect } from 'react';
import Login from './Login';
import BirdList from './BirdList';
import AddBird from './AddBird';
/*import './App.css'*/
import BirdSuggestions from './BirdSuggestions';
import DropdownMenu from './DropdownMenu';
import UserListForm from './UserListForm';
import ViewLists from './ViewLists';
import ShowList from './ShowList';

function App() {
  const [birds, setBirds] = useState([]);
  const [user, setUser] = useState(null);
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [birdName, setBirdName] = useState('');
  const [currentView, setCurrentView] = useState('birdedex');

  const fetchBirds = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/birds', { credentials: 'include' });
      if(response.ok) {
        const data = await response.json();
        console.log(data);
        setBirds(data);
      } else {
        console.error('Error fetching birds');
      }
    } catch (error) {
      console.error('Error fetching birds:', error);
    }
  };

  

  useEffect(() => {
    fetchBirds();
  }, []);

  const addBird = (birdName) => {
    const newBird = {
      birdid: birds.length + 1, // This is a placeholder, replace it with your own logic
      bird: birdName,
      seen: 'Not sighted' // This is a placeholder, replace it with your own logic
    };
    setBirds(prevBirds => [...prevBirds, newBird]);
  };

  return (
    <div className="App">
      <select onChange={(e) => setCurrentView(e.target.value)}>
        <option value="birdedex">Birdedex</option>
        <option value="userlists">User Lists</option>
      </select>

      <AddBird onAddBird={addBird} />

      {currentView === 'birdedex' ? (
        <BirdList birds={birds} />
      ) : (
        <ViewLists userid={user?.id} />
      )}
    </div>
  );
}

export default App;
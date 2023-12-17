import React, { useState } from 'react';
import BirdSuggestions from './BirdSuggestions';

function AddBird({ onAddBird, onBirdNameChange }) {
  const [birdName, setBirdName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddBird(birdName);
    setBirdName('');  // Clear the input
  };

  const handleSuggestionClick = (bird) => {
    setBirdName(bird);
    onBirdNameChange(bird);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          value={birdName}
          onChange={(e) => setBirdName(e.target.value)}
          placeholder="Enter bird name"
          required
        />
        <button type="submit">Add Bird</button>
      </form>
      <BirdSuggestions query={birdName} onSuggestionClick={handleSuggestionClick} />
    </div>
  );
}

export default AddBird;
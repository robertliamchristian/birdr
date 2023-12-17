import React, { useState } from 'react';
import BirdSuggestions from './BirdSuggestions';
import IdentifyBird from './IdentifyBird'; // Import IdentifyBird

function AddBird({ onAddBird, onBirdNameChange }) {
  const [birdName, setBirdName] = useState('');
  const [colors, setColors] = useState([]); // Add state for colors

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddBird(birdName);
    setBirdName('');  // Clear the input
  };

  const handleSuggestionClick = (bird) => {
    setBirdName(bird);
    onBirdNameChange(bird);
  };

  const handleColorSelect = (selectedColors) => { // Add handler for color selection
    setColors(selectedColors);
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
      <IdentifyBird onColorSelect={handleColorSelect} /> {/* Add IdentifyBird component */}
      <BirdSuggestions query={birdName} colors={colors} onSuggestionClick={handleSuggestionClick} /> {/* Pass colors to BirdSuggestions */}
    </div>
  );
}

export default AddBird;
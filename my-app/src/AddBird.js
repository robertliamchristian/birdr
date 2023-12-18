import React, { useState } from 'react';
import BirdSuggestions from './BirdSuggestions';
import IdentifyBird from './IdentifyBird';

function AddBird({ onAddBird, onBirdNameChange }) {
  const [birdName, setBirdName] = useState('');
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]); // Add state for regions

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddBird(birdName);
    setBirdName('');  // Clear the input
  };

  const handleSuggestionClick = (bird) => {
    setBirdName(bird);
    onBirdNameChange(bird);
  };

  const handleColorSelect = (selectedColors) => {
    setColors(selectedColors);
  };

  const handleRegionSelect = (selectedRegions) => { // Add handler for region selection
    setRegions(selectedRegions);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          value={birdName}
          onChange={event => setBirdName(event.target.value)}
          placeholder="Enter a bird name"
        />
        <button type="submit">Add Bird</button>
      </form>
      <IdentifyBird onColorSelect={handleColorSelect} onRegionSelect={handleRegionSelect} /> {/* Pass handleRegionSelect to IdentifyBird */}
      <BirdSuggestions query={birdName} colors={colors} regions={regions} onSuggestionClick={handleSuggestionClick} /> {/* Pass regions to BirdSuggestions */}
    </div>
  );
}

export default AddBird;
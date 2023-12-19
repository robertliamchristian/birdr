import React, { useState } from 'react';
import BirdSuggestions from './BirdSuggestions';
import IdentifyBird from './IdentifyBird';

function AddBird({ onAddBird, onBirdNameChange }) {
  const [birdName, setBirdName] = useState('');
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]); // Add state for regions
  const [showIdentifyBird, setShowIdentifyBird] = useState(false); // Add state for showing IdentifyBird


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
    <div className="add-bird-container">
      <form className="bird-form" onSubmit={handleSubmit}>
        <input
          type="text" 
          value={birdName}
          onChange={event => setBirdName(event.target.value)}
          placeholder="Enter Bird Name..."
        />
        <button type="submit">ADD BIRD</button>
      </form>
      {showIdentifyBird && <IdentifyBird onColorSelect={handleColorSelect} onRegionSelect={handleRegionSelect} />}
      <BirdSuggestions query={birdName} colors={colors} regions={regions} onSuggestionClick={handleSuggestionClick} />
    </div>
  );
  
}

export default AddBird;
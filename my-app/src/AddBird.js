import React, { useState } from 'react';
import BirdSuggestions from './BirdSuggestions';
import IdentifyBird from './IdentifyBird';

function AddBird({ onAddBird }) {
  const [inputValue, setInputValue] = useState(''); // New state for the input value
  const [birdName, setBirdName] = useState(''); // This will be the bird name for the suggestions
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [showIdentifyBird, setShowIdentifyBird] = useState(false); // Re-added this line

  
  const handleSubmit = (event) => {
    event.preventDefault();
    onAddBird(inputValue);
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setBirdName(event.target.value); // Set birdName for suggestions when typing
  };

  const handleSuggestionClick = (bird) => {
    setInputValue(bird); // Set inputValue to the clicked suggestion
    setBirdName(''); // Clear the bird name for suggestions so it doesn't show in the suggestion list
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
      value={inputValue} // Make sure this is using inputValue
      onChange={handleInputChange} // Ensure this is handling changes
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
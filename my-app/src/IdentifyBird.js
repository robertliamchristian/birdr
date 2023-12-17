import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function IdentifyBird({ onColorSelect }) {
  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5002/api/colors')
      .then(response => response.json())
      .then(data => setColors(data.map(color => ({ value: color, label: color }))));
  }, []);

  const handleColorSelect = (selectedOptions) => {
    const newSelectedColors = selectedOptions.map(option => option.value);
    setSelectedColors(newSelectedColors);
    onColorSelect(newSelectedColors);
  };

  return (
    <div>
      <h3>Identify a bird</h3>
      <label>Color:</label>
      <Select
        isMulti
        options={colors}
        onChange={handleColorSelect}
      />
    </div>
  );
}

export default IdentifyBird;
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function IdentifyBird({ onColorSelect, onRegionSelect }) {
  const [colors, setColors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5002/api/colors')
      .then(response => response.json())
      .then(data => setColors(data.map(color => ({ value: color, label: color }))));

    fetch('http://localhost:5002/api/regions')
      .then(response => response.json())
      .then(data => setRegions(data.map(region => ({ value: region, label: region }))));
  }, []);

  const handleColorSelect = (selectedOptions) => {
    const newSelectedColors = selectedOptions.map(option => option.value);
    setSelectedColors(newSelectedColors);
    onColorSelect(newSelectedColors);
  };

  const handleRegionSelect = (selectedOptions) => {
    const newSelectedRegions = selectedOptions.map(option => option.value);
    setSelectedRegions(newSelectedRegions);
    onRegionSelect(newSelectedRegions);
  };

  return (
    <div>
      
      <label>Color:</label>
      <Select
        isMulti
        options={colors}
        onChange={handleColorSelect}
      />
      <label>Region:</label>
      <Select
        isMulti
        options={regions}
        onChange={handleRegionSelect}
      />
    </div>
  );
}

export default IdentifyBird;
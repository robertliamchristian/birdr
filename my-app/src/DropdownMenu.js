import React, { useState } from 'react';
import IdentifyBird from './IdentifyBird';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleColorSelect = (colors) => {
    setSelectedColors(colors);
  };

  const handleRegionSelect = (regions) => {
    setSelectedRegions(regions);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        Identify a bird
      </button>

      {isOpen && (
        <IdentifyBird 
          onColorSelect={handleColorSelect} 
          onRegionSelect={handleRegionSelect} 
        />
      )}
    </div>
  );
}

export default DropdownMenu;
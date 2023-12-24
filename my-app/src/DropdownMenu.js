import React, { useState } from 'react';
import IdentifyBird from './IdentifyBird';
import ViewLists from './ViewLists';
import ShowList from './ShowList';
import AddBirdToList from './AddBirdToList';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);  // Add this line

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleColorSelect = (colors) => {
    setSelectedColors(colors);
  };

  const handleRegionSelect = (regions) => {
    setSelectedRegions(regions);
  };

  const handleListSelect = (listid) => {  // Add this function
    setSelectedListId(listid);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        More Options
      </button>
      {isOpen && (
        <div className='dropdownmain'>

          <div className='IDbirdtext'><IdentifyBird onColorSelect={handleColorSelect} onRegionSelect={handleRegionSelect} /></div>
          
          <div className='viewlists'><ViewLists onSelect={handleListSelect} /></div>
          
          <div className='selects'>{selectedListId && <AddBirdToList listid={selectedListId} />}
          {selectedListId && <ShowList listid={selectedListId} />}</div>
          
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
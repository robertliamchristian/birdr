import React, { useState } from 'react';

function AddBird({ onAddBird }) {
    const [birdName, setBirdName] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onAddBird(birdName);
      setBirdName('');  // Clear the input
    };
  
    return (
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
    );
  }

export default AddBird;
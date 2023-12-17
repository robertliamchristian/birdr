import React, { useState, useEffect } from 'react';

function BirdSuggestions({ query, onSuggestionClick }) { // Add onSuggestionClick prop
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`http://localhost:5002/api/birds/suggestions?query=${query}`)
        .then(response => response.json())
        .then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <ul>
      {suggestions.map((bird, index) => (
        <li key={index} onClick={() => onSuggestionClick(bird)}>{bird}</li> // Add onClick handler
      ))}
    </ul>
  );
}

export default BirdSuggestions;
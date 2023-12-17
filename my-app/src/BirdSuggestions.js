import React, { useState, useEffect } from 'react';

function BirdSuggestions({ query, colors, onSuggestionClick }) { // Add colors prop
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query || colors.length > 0) {
      // Include colors in the fetch request
      fetch(`http://localhost:5002/api/birds/suggestions?query=${query}&colors=${colors.join(',')}`)
        .then(response => response.json())
        .then(data => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [query, colors]); // Add colors to the dependency array

  return (
    <ul>
      {suggestions.map((bird, index) => (
        <li key={index} onClick={() => onSuggestionClick(bird)}>{bird}</li>
      ))}
    </ul>
  );
}

export default BirdSuggestions;
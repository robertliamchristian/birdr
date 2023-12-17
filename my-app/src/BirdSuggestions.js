import React, { useState, useEffect } from 'react';

function BirdSuggestions({ query, colors, onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query || colors.length > 0) {
      let url = new URL('http://localhost:5002/api/birds/suggestions');
      let params = new URLSearchParams({ query: query });
  
      // Append each color as a separate entry
      colors.forEach(color => params.append('color', color));
      url.search = params.toString();
  
      console.log(url.toString());
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSuggestions(data);
        });
    } else {
      setSuggestions([]);
    }
  }, [query, colors]);
  

  return (
    <ul>
      {suggestions.map((bird, index) => (
        <li key={index} onClick={() => onSuggestionClick(bird)}>{bird}</li>
      ))}
    </ul>
  );
}

export default BirdSuggestions;
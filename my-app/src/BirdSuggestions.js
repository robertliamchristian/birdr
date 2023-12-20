import React, { useState, useEffect } from 'react';

function BirdSuggestions({ query, colors, regions, onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query && (query.length > 0 || colors.length > 0 || regions.length > 0)) {
      let url = new URL('http://localhost:5002/api/birdsuggestions');
      let params = new URLSearchParams({ query: query });
  
      // Append each color and region as a separate entry
      colors.forEach(color => params.append('color', color));
      regions.forEach(region => params.append('region', region));
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
  }, [query, colors, regions]);
  

  return (
    <div className='slist'>
    <ul>
      {suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => onSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
    </div>
  );
}

export default BirdSuggestions;


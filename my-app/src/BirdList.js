function BirdList({ birds }) {
    return (
      <ul>
        {birds.map(bird => (
          <li 
            key={bird.birdid}
            style={{ 
              fontWeight: bird.sighted ? 'bold' : 'normal',
              fontStyle: bird.sighted ? 'normal' : 'italic',
              color: bird.sighted ? 'black' : 'gray'
            }}>
            {bird.bird}
          </li>
        ))}
      </ul>
    );
  }
  
  export default BirdList;
  
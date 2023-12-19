function BirdList({ birds }) {
  return (
    <ol>
      {birds.map(bird => (
        <li 
          key={bird.birdid}
          style={{ 
            fontWeight: bird.seen === 'Sighted' ? 'bold' : 'normal',
            fontStyle: bird.seen === 'Sighted' ? 'normal' : 'italic',
            color: bird.seen === 'Sighted' ? '#000557' : 'gray'
          }}>
          {bird.bird}
        </li>
      ))}
    </ol>
  );
}
  
  export default BirdList;
  
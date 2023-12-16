function BirdList({ birds }) {
  return (
    <ul>
      {birds.map(bird => (
        <li 
          key={bird.birdid}
          style={{ 
            fontWeight: bird.seen === 'Sighted' ? 'bold' : 'normal',
            fontStyle: bird.seen === 'Sighted' ? 'normal' : 'italic',
            color: bird.seen === 'Sighted' ? 'black' : 'gray'
          }}>
          {bird.bird}
        </li>
      ))}
    </ul>
  );
}
  
  export default BirdList;
  
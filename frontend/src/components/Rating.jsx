import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Returns the appropriate star icon for a given star position based on
// the rating value (e.g. position 3 with value 2.5 -> half star).
const StarIcon = ({ value, position }) => {
  if (value >= position) {
    return <FaStar />;
  }

  if (value >= position - 0.5) {
    return <FaStarHalfAlt />;
  }

  return <FaRegStar />;
};

const STAR_POSITIONS = [1, 2, 3, 4, 5];

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className='rating'>
      {STAR_POSITIONS.map((position) => (
        <span key={position}>
          <StarIcon value={value} position={position} />
        </span>
      ))}
      <span className='rating-text'>{text}</span>
    </div>
  );
};

export default Rating;

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  const renderStar = (starValue) => {
    if (value >= starValue) {
      return <FaStar color={color} />;
    }

    if (value >= starValue - 0.5) {
      return <FaStarHalfAlt color={color} />;
    }

    return <FaRegStar color={color} />;
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {renderStar(star)}
        </span>
      ))}

      {text && (
        <span className="rating-text">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
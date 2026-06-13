import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="text-center">
      <Spinner
        animation="border"
        role="status"
        style={{
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
};

export default Loader;
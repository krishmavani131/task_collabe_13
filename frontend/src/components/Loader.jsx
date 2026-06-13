import { Spinner } from 'react-bootstrap';

const loaderStyle = {
  width: '100px',
  height: '100px',
  margin: 'auto',
  display: 'block',
};

const Loader = () => <Spinner animation='border' role='status' style={loaderStyle} />;

export default Loader;

import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    {
      label: 'Sign In',
      path: '/login',
      enabled: step1,
    },
    {
      label: 'Shipping',
      path: '/shipping',
      enabled: step2,
    },
    {
      label: 'Payment',
      path: '/payment',
      enabled: step3,
    },
    {
      label: 'Place Order',
      path: '/placeorder',
      enabled: step4,
    },
  ];

  return (
    <Nav className="justify-content-center mb-4">
      {steps.map(({ label, path, enabled }) => (
        <Nav.Item key={label}>
          <Nav.Link
            as={enabled ? Link : 'span'}
            to={enabled ? path : undefined}
            disabled={!enabled}
          >
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CheckoutSteps;
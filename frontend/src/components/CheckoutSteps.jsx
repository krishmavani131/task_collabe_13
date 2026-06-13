import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const steps = [
  { label: 'Sign In', path: '/login' },
  { label: 'Shipping', path: '/shipping' },
  { label: 'Payment', path: '/payment' },
  { label: 'Place Order', path: '/placeorder' },
];

function StepLink({ isActive, path, label }) {
  if (isActive) {
    return (
      <Nav.Link as={Link} to={path}>
        {label}
      </Nav.Link>
    );
  }
  return <Nav.Link disabled>{label}</Nav.Link>;
}

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const stepFlags = [step1, step2, step3, step4];

  return (
    <Nav className='justify-content-center mb-4'>
      {steps.map((step, index) => (
        <Nav.Item key={step.path}>
          <StepLink
            isActive={stepFlags[index]}
            path={step.path}
            label={step.label}
          />
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default CheckoutSteps;
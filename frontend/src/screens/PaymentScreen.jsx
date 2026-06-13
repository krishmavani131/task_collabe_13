import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
const navigate = useNavigate();
const dispatch = useDispatch();

const cart = useSelector((state) => state.cart);
const shippingAddress = cart?.shippingAddress || {};

// ✅ Redirect safety check
useEffect(() => {
if (!shippingAddress?.address) {
navigate('/shipping');
}
}, [navigate, shippingAddress]);

// ✅ Default payment method
const [paymentMethod, setPaymentMethod] = useState('PayPal');

// ✅ Submit handler with safety
const submitHandler = (e) => {
e.preventDefault();

```
if (!paymentMethod) {
  alert('Please select payment method');
  return;
}

dispatch(savePaymentMethod(paymentMethod));
navigate('/placeorder');
```

};

return ( <FormContainer> <CheckoutSteps step1 step2 step3 />

```
  <h1>Payment Method</h1>

  <Form onSubmit={submitHandler}>
    <Form.Group>
      <Form.Label as="legend">Select Method</Form.Label>

      <Col>
        <Form.Check
          className="my-2"
          type="radio"
          label="PayPal or Credit Card"
          id="PayPal"
          name="paymentMethod"
          value="PayPal"
          checked={paymentMethod === 'PayPal'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
      </Col>
    </Form.Group>

    <Button type="submit" variant="primary">
      Continue
    </Button>
  </Form>
</FormContainer>
);
};

export default PaymentScreen;

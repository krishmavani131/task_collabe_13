import dotenv from 'dotenv';

dotenv.config();

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_APP_SECRET,
  PAYPAL_API_URL,
} = process.env;

const getPayPalAccessToken = async () => {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`
  ).toString('base64');

  const endpoint = `${PAYPAL_API_URL}/v1/oauth2/token`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();

  return data.access_token;
};

export const checkIfNewTransaction = async (
  orderModel,
  paypalTransactionId
) => {
  try {
    const existingOrders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });

    return existingOrders.length === 0;
  } catch (error) {
    console.error(error);
  }
};

export const verifyPayPalPayment = async (paypalTransactionId) => {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  const paymentData = await response.json();

  return {
    verified: paymentData.status === 'COMPLETED',
    value: paymentData.purchase_units[0].amount.value,
  };
};
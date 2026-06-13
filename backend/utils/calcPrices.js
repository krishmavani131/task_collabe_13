const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (total, product) => total + (product.price * 100 * product.qty) / 100,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxRate = 0.15;
  const taxPrice = taxRate * itemsPrice;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: formatPrice(itemsPrice),
    shippingPrice: formatPrice(shippingPrice),
    taxPrice: formatPrice(taxPrice),
    totalPrice: formatPrice(totalPrice),
  };
};
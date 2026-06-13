const formatPrice = (value) => {
  return (Math.round(value * 100) / 100).toFixed(2);
};

export const calcPrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (total, product) => total + (product.price * 100 * product.qty) / 100,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxPrice = itemsPrice * 0.15;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: formatPrice(itemsPrice),
    shippingPrice: formatPrice(shippingPrice),
    taxPrice: formatPrice(taxPrice),
    totalPrice: formatPrice(totalPrice),
  };
};
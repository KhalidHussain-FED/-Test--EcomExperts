const productVariantIdToRemove = 44182115647642;

// Making a POST request to clear.js
fetch('/cart/clear.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    products: [productVariantIdToRemove],
  }),
})
  .then(response => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    return response.json(); // Assuming clear.js returns JSON
  })
  .then(data => {
    // Handle the response data if needed
    console.log('Cart cleared successfully', data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error clearing cart:', error.message);
  });

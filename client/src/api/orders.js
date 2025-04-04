import axios from 'axios';

const API_URL = '/api/orders';

const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, {
    user_id: orderData.user_id,
    user_email: orderData.user_email,
    products: orderData.products,
    phone_number: orderData.phone_number,
    delivery_method: orderData.delivery_method,
    address: orderData.address
  });
  return response.data;
};

export default {
  createOrder
};

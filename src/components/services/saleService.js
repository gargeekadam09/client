import axios from 'axios';

const API_BASE_URL = 'https://backend-1-3sa0.onrender.com/api/sales'; // Update if needed

// Get sales for the logged-in customer
export const getCustomerSales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new sale
export const createSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, saleData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

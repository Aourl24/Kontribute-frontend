import axios from 'axios';
//'http://10.85.70.92:8000/api';
const backend_url = "http://127.0.0.1:8000/api"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || backend_url;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Collections
export const createCollection = async (data) => {
  const response = await api.post('/collections/', data);
  return response.data;
};

export const getCollection = async (slug) => {
  const response = await api.get(`/collections/${slug}/`);
  return response.data;
};

export const getDashboard = async (slug) => {
  const response = await api.get(`/collections/${slug}/dashboard/`);
  return response.data;
};

// Contributions
export const makeContribution = async (slug, data) => {
  const response = await api.post(`/collections/${slug}/contribute/`, data);
  return response.data;
};

export const confirmPayment = async (slug, data) => {
  const response = await api.post(`/collections/${slug}/confirm-payment/`, data);
  return response.data;
};

// Actions
export const sendReminders = async (slug, data = {}) => {
  const response = await api.post(`/collections/${slug}/remind/`, data);
  return response.data;
};

export const requestWithdrawal = async (slug, data) => {
  const response = await api.post(`/collections/${slug}/withdraw/`, data);
  return response.data;
};

// Receipt
export const getReceipt = async (contributorId) => {
  const response = await api.get(`/receipts/${contributorId}/`);
  return response.data;
};

/**
 * Make an AUTOMATIC contribution (Paystack payment)
 */
export const makeAutomaticContribution = async (slug, data) => {
    const response = await api.post(`/collections/${slug}/contribute-auto/`,data);
    return response.data;
  } 

/**
 * Verify payment after Paystack redirect
 */
export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-payment/${reference}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Confirm manual payment (by organizer)
 */
export const confirmPayment = async (slug, confirmationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/collections/${slug}/confirm-payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmationData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};


export default api;
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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

export default api;
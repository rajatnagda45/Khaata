import axios from 'axios';

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return '/api';
  }

  return 'http://localhost:5001/api';
};

const client = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000
});

export default client;

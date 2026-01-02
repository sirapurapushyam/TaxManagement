import axios from 'axios';

const BASE_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taxApi = {
  getAll: async () => {
    const response = await api.get('/taxes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/taxes/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/taxes/${id}`, data);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/taxes', data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/taxes/${id}`);
  },
};

export const countryApi = {
  getAll: async () => {
    const response = await api.get('/countries');
    return response.data;
  },
};
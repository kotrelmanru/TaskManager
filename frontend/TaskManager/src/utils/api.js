// src/utils/api.js
import axios from 'axios';

// Create base API for tasks
export const createTaskApi = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: 'http://localhost:8000/api/v1/tasks',
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Create base API for user-related endpoints
export const createUserApi = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: { Authorization: `Bearer ${token}` }
  });
};

// API Operations for tasks
export const taskService = {
  fetchAll: async () => {
    const api = createTaskApi();
    const res = await api.get('/');
    return res.data.tasks || [];
  },
  
  create: async (taskData) => {
    const api = createTaskApi();
    return await api.post('/', taskData);
  },
  
  update: async (id, taskData) => {
    const api = createTaskApi();
    return await api.put(`/${id}`, taskData);
  },
  
  delete: async (id) => {
    const api = createTaskApi();
    return await api.delete(`/${id}`);
  }
};

// API Operations for user
export const userService = {
  getProfile: async () => {
    const api = createUserApi();
    const res = await api.get('/auth/profile');
    return res.data;
  },
  
  getUsers: async () => {
    const api = createUserApi();
    const response = await api.get('/auth/users');
    return response.data.users || [];
  }
};